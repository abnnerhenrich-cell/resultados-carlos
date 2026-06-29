const axios = require("axios");
const cheerio = require("cheerio");
const { normalizarPremio } = require("./bichos");

async function baixar(url) {
  const r = await axios.get(url, {
    timeout: 20000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  return r.data;
}

function limpar(t) {
  return String(t || "")
    .replace(/\s+/g, " ")
    .replace(/Resultado do Jogo do Bicho/gi, "")
    .trim();
}

function extrairData(texto) {
  const m = texto.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (!m) return new Date().toISOString().slice(0, 10);

  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

function extrairHorario(texto) {
  const m = texto.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  if (!m) return "Atual";

  return `${m[1].padStart(2, "0")}h${m[2] || ""}`;
}

function extrairPremios(texto) {
  const premios = [];

  const padroes = [
    /(1|2|3|4|5)[º°]?\s*(?:prêmio|premio)?\s*[:\-]?\s*([0-9]{4,5})\s*(?:[-–—]?\s*)?([A-Za-zÀ-ÿçÇãõÃÕ\s]{3,30})?\s*(?:grupo|g\.?|gr)?\s*([0-9]{1,2})?/gi,

    /(1|2|3|4|5)\s*[-–—]\s*([0-9]{4,5})\s*[-–—]?\s*([A-Za-zÀ-ÿçÇãõÃÕ\s]{3,30})?\s*([0-9]{1,2})?/gi,
  ];

  for (const re of padroes) {
    let m;

    while ((m = re.exec(texto)) && premios.length < 5) {
      const posicao = Number(m[1]);

      if (premios.some((p) => Number(p.posicao) === posicao)) continue;

      premios.push(
        normalizarPremio(
          posicao,
          String(m[2]).slice(-4),
          limpar(m[3] || ""),
          m[4]
        )
      );
    }

    if (premios.length >= 5) break;
  }

  return premios.sort((a, b) => Number(a.posicao) - Number(b.posicao));
}

function parse(html, loteria, nome, fonte) {
  const $ = cheerio.load(html);

  const candidatos = [];

  $("table, article, section, div, main").each((_, el) => {
    const t = limpar($(el).text());

    if (
      t.length > 80 &&
      /1[º°]?/.test(t) &&
      /2[º°]?/.test(t) &&
      /3[º°]?/.test(t) &&
      /4[º°]?/.test(t) &&
      /5[º°]?/.test(t) &&
      /\d{4}/.test(t)
    ) {
      candidatos.push(t);
    }
  });

  const body = limpar($("body").text());
  candidatos.push(body);

  let melhor = null;
  let melhoresPremios = [];

  for (const texto of candidatos) {
    const premios = extrairPremios(texto);

    if (premios.length > melhoresPremios.length) {
      melhor = texto;
      melhoresPremios = premios;
    }

    if (premios.length >= 5) break;
  }

  if (melhoresPremios.length < 5) {
    throw new Error(
      `Não encontrei 1º ao 5º prêmio na fonte: ${fonte}. Encontrados: ${melhoresPremios.length}`
    );
  }

  return {
    loteria,
    nome,
    data: extrairData(melhor || body),
    horario: extrairHorario(melhor || body),
    premios: melhoresPremios.slice(0, 5),
    fonte,
    timestamp: Date.now(),
    criadoEm: new Date().toISOString(),
  };
}

async function coletarDeFontes(loteria, nome, urls) {
  const erros = [];

  for (const url of urls) {
    try {
      const html = await baixar(url);
      return parse(html, loteria, nome, url);
    } catch (e) {
      erros.push(`${url}: ${e.message}`);
    }
  }

  throw new Error(erros.join(" | "));
}

module.exports = { coletarDeFontes };
