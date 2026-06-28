<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sistema Inteligente JB</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <div>
        <p class="tag">Sistema Inteligente JB</p>
        <h1>Resultados Automáticos</h1>
        <p>Rio • Look Goiás • Nacional — 1º ao 5º prêmio com análise estatística.</p>
      </div>
      <div class="update-box">
        <span>Última atualização</span>
        <strong id="lastUpdate">--</strong>
      </div>
    </header>

    <section class="tabs" aria-label="Escolha a loteria">
      <button class="tab active" data-loteria="rio">📊 Rio</button>
      <button class="tab" data-loteria="look">📊 Look Goiás</button>
      <button class="tab" data-loteria="nacional">📊 Nacional</button>
    </section>

    <section class="panel selected">
      <div>
        <h2 id="tituloLoteria">Rio</h2>
        <p id="subtitulo">Buscando resultado mais recente...</p>
      </div>
      <button id="refreshBtn">Atualizar tela</button>
    </section>

    <section class="grid">
      <div class="panel">
        <h2>Resultado do 1º ao 5º</h2>
        <div id="resultado" class="resultado empty">Carregando...</div>
      </div>

      <div class="panel">
        <h2>Ranking estatístico</h2>
        <div id="ranking" class="ranking empty">Aguardando histórico.</div>
      </div>
    </section>

    <section class="grid three">
      <div class="panel"><h3>Grupos fortes</h3><div id="gruposFortes"></div></div>
      <div class="panel"><h3>Dezenas fortes</h3><div id="dezenasFortes"></div></div>
      <div class="panel"><h3>Bichos atrasados</h3><div id="atrasados"></div></div>
    </section>

    <section class="panel">
      <h2>Histórico coletado</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Horário</th><th>Prêmio</th><th>Milhar</th><th>Grupo</th><th>Bicho</th></tr></thead>
          <tbody id="historico"></tbody>
        </table>
      </div>
    </section>

    <footer>
      <p>Este sistema gera análise estatística. Não existe garantia de acerto em sorteios.</p>
    </footer>
  </main>

  <script type="module" src="app.js"></script>
</body>
</html>
