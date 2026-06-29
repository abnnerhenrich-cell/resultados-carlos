const axios = require('axios');
const cheerio = require('cheerio');
const { normalizarPremio } = require('./bichos');

async function baixar(url) {
  const r = await axios.get(url, {
    timeout: 20000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  return r.data;
}

function limpar(t) {
  return String(t || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function textoOriginalLimpo(t) {
  return String(t || '').replace(/\s+/g, ' ').trim();
}

function normalizarBusca(t) {
  return limpar(t).toLowerCase();
}

function extrairData(texto) {
  const m = texto.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (!m) return new Date().toISOString().slice(0, 10);
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

function extrairHorario(texto) {
  const m = texto.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  if (!m) return 'Atual';
  return `${m[1].padStart(2, '0')}h${m[2] || ''}`;
}

function scoreFonte(texto, config) {
  const alvo = normalizarBusca(texto);
  let score = 0;

  for (const termo of config.include || []) {
    if (alvo.includes(normalizarBusca(termo))) score += 20;
  }

  for (const termo of config.exclude || []) {
    if (alvo.includes(normalizarBusca(termo))) score -= 80;
  }

  if (/1[º°]?\s*(premio|prêmio)?/i.test(texto)) score += 10;
  if (/2[º°]?\s*(premio|prêmio)?/i.test(texto)) score += 10;
  if (/3[º°]?\s*(premio|prêmio)?/i.test(texto)) score += 10;
  if (/4[º°]?\s*(premio|prêmio)?/i.test(texto)) score += 10;
  if (/5[º°]?\s*(premio|prêmio)?/i.test(texto)) score += 10;
  if (/\d{4}/.test(texto)) score += 10;

  return score;
}

function extrairPremios(texto) {
  const premios = [];
  const usados = new Set();

  const padroes = [
    /(1|2|3|4|5)[º°]?\s*(?:pr[eê]mio|premio)?\s*[:\-–—]?\s*([0-9]{4,5})\s*(?:[-–—]?\s*)?([A-Za-zÀ-ÿçÇãõÃÕ\s]{3,30})?\s*(?:grupo|g\.?|gr)?\s*([0-9]{1,2})?/gi,
    /(1|2|3|4|5)\s*[-–—]\s*([0-9]{4,5})\s*[-–—]?\s*([A-Za-zÀ-ÿçÇãõÃÕ\s]{3,30})?\s*([0-9]{1,2})?/gi
  ];

  for (const re of padroes) {
    let m;
    while ((m = re.exec(texto)) && premios.length < 5) {
      const posicao = Number(m[1]);
      if (usados.has(posicao)) continue;
      usados.add(posicao);

      premios.push(
        normalizarPremio(
          posicao,
          String(m[2]).slice(-4),
          textoOriginalLimpo(m[3] || ''),
          m[4]
        )
      );
    }
    if (premios.length >= 5) break;
  }

  return premios.sort((a, b) => Number(a.posicao) - Number(b.posicao));
}

function coletarCandidatos($) {
  const candidatos = [];
  $('table, article, section, main, div').each((_, el) => {
    const t = textoOriginalLimpo($(el).text());
    if (t.length > 80 && /\d{4}/.test(t) && /1[º°]?/.test(t) && /5[º°]?/.test(t)) {
      candidatos.push(t);
    }
  });
  candidatos.push(textoOriginalLimpo($('body').text()));
  return [...new Set(candidatos)].filter(Boolean);
}

function validarLoteria(texto, loteria, config, fonte) {
  const alvo = normalizarBusca(`${fonte} ${texto}`);

  for (const termo of config.exclude || []) {
    if (alvo.includes(normalizarBusca(termo))) {
      throw new Error(`Bloco rejeitado para ${loteria}: encontrou termo proibido "${termo}"`);
    }
  }

  if ((config.include || []).length) {
    const ok = config.include.some((termo) => alvo.includes(normalizarBusca(termo)));
    if (!ok) throw new Error(`Bloco rejeitado para ${loteria}: não confirmou a loteria correta.`);
  }
}

function parse(html, loteria, nome, fonteConfig) {
  const fonte = typeof fonteConfig === 'string' ? fonteConfig : fonteConfig.url;
  const config = typeof fonteConfig === 'string' ? {} : fonteConfig;
  const $ = cheerio.load(html);
  const candidatos = coletarCandidatos($);

  let melhor = null;
  let melhoresPremios = [];
  let melhorScore = -9999;

  for (const texto of candidatos) {
    const premios = extrairPremios(texto);
    const pontos = scoreFonte(`${fonte} ${texto}`, config) + premios.length * 30;

    if (premios.length >= 5 && pontos > melhorScore) {
      melhor = texto;
      melhoresPremios = premios;
      melhorScore = pontos;
    }
  }

  if (!melhor || melhoresPremios.length < 5) {
    throw new Error(`Não encontrei 1º ao 5º prêmio correto na fonte: ${fonte}`);
  }

  validarLoteria(melhor, loteria, config, fonte);

  return {
    loteria,
    nome,
    data: extrairData(melhor),
    horario: extrairHorario(melhor),
    premios: melhoresPremios.slice(0, 5),
    fonte,
    timestamp: Date.now(),
    criadoEm: new Date().toISOString()
  };
}

async function coletarDeFontes(loteria, nome, fontes) {
  const erros = [];

  for (const fonteConfig of fontes) {
    const url = typeof fonteConfig === 'string' ? fonteConfig : fonteConfig.url;
    try {
      const html = await baixar(url);
      return parse(html, loteria, nome, fonteConfig);
    } catch (e) {
      erros.push(`${url}: ${e.message}`);
    }
  }

  throw new Error(erros.join(' | '));
}

module.exports = { coletarDeFontes };
