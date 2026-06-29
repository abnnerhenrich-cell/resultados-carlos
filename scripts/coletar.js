const admin = require('firebase-admin');
const fontes = require('../functions/fontes');
const { coletarDeFontes } = require('../functions/scraperGenerico');

const NOMES = { rio: 'Rio / PT-Rio', look: 'Look Goiás', nacional: 'Nacional' };

function initAdmin() {
  if (admin.apps.length) return;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('Faltou o secret FIREBASE_SERVICE_ACCOUNT no GitHub.');
  const serviceAccount = JSON.parse(raw);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

async function salvar(r) {
  const db = admin.firestore();
  const id = `${r.loteria}_${r.data}_${String(r.horario).replace(/\W/g, '')}`;
  await db.collection('resultados').doc(id).set(r, { merge: true });
  return id;
}

async function coletarTodas() {
  initAdmin();
  const saida = { ok: [], erros: [] };
  for (const loteria of ['rio', 'look', 'nacional']) {
    try {
      const r = await coletarDeFontes(loteria, NOMES[loteria], fontes[loteria]);
      const id = await salvar(r);
      saida.ok.push({ id, loteria: r.loteria, data: r.data, horario: r.horario, fonte: r.fonte });
    } catch (e) {
      saida.erros.push({ loteria, erro: e.message });
    }
  }
  console.log(JSON.stringify(saida, null, 2));
  if (!saida.ok.length) process.exit(1);
}

coletarTodas();
