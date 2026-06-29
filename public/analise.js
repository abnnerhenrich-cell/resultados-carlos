const bichos = {
  "01": "Avestruz", "02": "Águia", "03": "Burro", "04": "Borboleta", "05": "Cachorro",
  "06": "Cabra", "07": "Carneiro", "08": "Camelo", "09": "Cobra", "10": "Coelho",
  "11": "Cavalo", "12": "Elefante", "13": "Galo", "14": "Gato", "15": "Jacaré",
  "16": "Leão", "17": "Macaco", "18": "Porco", "19": "Pavão", "20": "Peru",
  "21": "Touro", "22": "Tigre", "23": "Urso", "24": "Veado", "25": "Vaca"
};

function iniciarMapaGrupos() {
  const mapa = {};
  for (let i = 1; i <= 25; i++) {
    const g = String(i).padStart(2, "0");
    mapa[g] = {
      valor: g,
      bicho: bichos[g],
      frequencia: 0,
      atraso: 0,
      recencia: 0,
      pontos: 0
    };
  }
  return mapa;
}

function pontuarGrupo(item, totalResultados) {
  const freqScore = item.frequencia * 12;
  const atrasoScore = Math.min(item.atraso * 3, 35);
  const recenciaScore = Math.max(0, 25 - item.recencia * 2);

  return Math.round(freqScore + atrasoScore + recenciaScore);
}

export function analisar(dados = []) {
  const grupos = iniciarMapaGrupos();
  const dezenas = {};
  const milhares = [];

  dados.forEach((resultado, indexResultado) => {
    (resultado.premios || []).forEach((p) => {
      const grupo = String(p.grupo || "").padStart(2, "0");
      const dezena = String(p.dezena || "").padStart(2, "0");
      const milhar = String(p.milhar || "").padStart(4, "0");

      if (grupos[grupo]) {
        grupos[grupo].frequencia++;
        if (grupos[grupo].recencia === 0) {
          grupos[grupo].recencia = indexResultado + 1;
        }
      }

      if (dezena) {
        dezenas[dezena] = (dezenas[dezena] || 0) + 1;
      }

      if (milhar) {
        milhares.push(milhar);
      }
    });
  });

  Object.values(grupos).forEach((g) => {
    const posicoes = [];

    dados.forEach((resultado, idx) => {
      const achou = (resultado.premios || []).some(
        (p) => String(p.grupo || "").padStart(2, "0") === g.valor
      );

      if (achou) posicoes.push(idx);
    });

    g.atraso = posicoes.length ? posicoes[0] : dados.length;
    g.pontos = pontuarGrupo(g, dados.length);
  });

  const gruposOrdenados = Object.values(grupos).sort((a, b) => b.pontos - a.pontos);

  const gruposFortes = gruposOrdenados.slice(0, 5);

  const atrasados = Object.values(grupos)
    .sort((a, b) => b.atraso - a.atraso)
    .slice(0, 5)
    .map((g) => ({
      ...g,
      pontos: `${g.atraso} sorteios`
    }));

  const dezenasFortes = Object.entries(dezenas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([valor]) => ({ valor }));

  const milharesSugeridas = gerarMilhares(gruposFortes, dezenasFortes);

  return {
    gruposFortes,
    dezenasFortes,
    atrasados,
    milharesSugeridas
  };
}

function gerarMilhares(gruposFortes, dezenasFortes) {
  const saida = [];

  gruposFortes.forEach((g, i) => {
    const dezena = dezenasFortes[i]?.valor || String(Number(g.valor) * 4).slice(-2).padStart(2, "0");
    const frente = String((Number(g.valor) * 37 + i * 13) % 100).padStart(2, "0");
    saida.push(`${frente}${dezena}`);
  });

  return [...new Set(saida)].slice(0, 8);
}
