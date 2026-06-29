const admin = require("firebase-admin");
const fontes = require("../functions/fontes");
const { coletarDeFontes } = require("../functions/scraperGenerico");

const NOMES = {
  rio: "Rio / PT-Rio",
  look: "Look Goiás",
  nacional: "Nacional",
};

function initAdmin() {
  if (admin.apps.length) return;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Faltou o secret FIREBASE_SERVICE_ACCOUNT no GitHub.");

  const serviceAccount = JSON.parse(raw);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

function gerarId(r) {
  const horario = String(r.horario || "atual").replace(/\W/g, "");
  return `${r.loteria}_${r.data}_${horario}`;
}

function assinaturaPremios(r) {
  return (r.premios || [])
    .slice(0, 5)
    .map((p) => `${p.posicao}:${p.milhar}:${p.grupo}`)
    .join("|");
}

async function salvarInteligente(r) {
  const db = admin.firestore();
  const id = gerarId(r);
  const ref = db.collection("resultados").doc(id);
  const snap = await ref.get();

  const novo = {
    ...r,
    assinatura: assinaturaPremios(r),
    atualizadoEm: new Date().toISOString(),
  };

  if (!snap.exists) {
    await ref.set({
      ...novo,
      criadoEm: new Date().toISOString(),
      statusColeta: "novo",
    });
    return { id, status: "novo" };
  }

  const antigo = snap.data();

  if (antigo.assinatura === novo.assinatura) {
    await ref.set(
      {
        atualizadoEm: new Date().toISOString(),
        statusColeta: "sem_alteracao",
      },
      { merge: true }
    );
    return { id, status: "sem_alteracao" };
  }

  await ref.set(
    {
      ...novo,
      statusColeta: "atualizado",
    },
    { merge: true }
  );

  return { id, status: "atualizado" };
}

async function coletarTodas() {
  initAdmin();

  const saida = {
    ok: [],
    erros: [],
  };

  for (const loteria of ["rio", "look", "nacional"]) {
    try {
      const r = await coletarDeFontes(loteria, NOMES[loteria], fontes[loteria]);

      if (!r.premios || r.premios.length < 5) {
        throw new Error("Resultado incompleto: menos de 5 prêmios.");
      }

      const salvo = await salvarInteligente(r);

      saida.ok.push({
        id: salvo.id,
        status: salvo.status,
        loteria: r.loteria,
        data: r.data,
        horario: r.horario,
        fonte: r.fonte,
      });
    } catch (e) {
      saida.erros.push({
        loteria,
        erro: e.message,
      });
    }
  }

  console.log(JSON.stringify(saida, null, 2));

  if (!saida.ok.length) {
    process.exit(1);
  }
}

coletarTodas();
