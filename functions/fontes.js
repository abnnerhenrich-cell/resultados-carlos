module.exports = {
  look: [
    {
      url: "https://deunoposte.app.br/goias/",
      include: ["goias", "goiás", "look"],
      exclude: ["rio de janeiro", "pt-rio", "nacional"]
    },
    {
      url: "https://www.eojogodobicho.com/resultado-jogo-bicho-look-goias.html",
      include: ["look", "goias", "goiás"],
      exclude: ["rio de janeiro", "pt-rio", "nacional"]
    }
  ],

  rio: [
    {
      url: "https://deunoposte.app.br/rio-de-janeiro/",
      include: ["rio de janeiro", "rio", "pt-rio"],
      exclude: ["goias", "goiás", "look", "nacional"]
    },
    {
      url: "https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/rj",
      include: ["rio", "rj"],
      exclude: ["goias", "goiás", "look", "nacional"]
    }
  ],

  nacional: [
    {
      url: "https://deunoposte.app.br/resultado-nacional/",
      include: ["nacional", "loteria nacional"],
      exclude: ["rio de janeiro", "pt-rio", "look", "goias", "goiás"]
    },
    {
      url: "https://www.resultadofacil.com.br/resultados-loteria-nacional-de-hoje",
      include: ["nacional", "loteria nacional"],
      exclude: ["rio de janeiro", "pt-rio", "look", "goias", "goiás"]
    }
  ]
};
