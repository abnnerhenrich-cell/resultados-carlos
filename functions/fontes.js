module.exports = {
  look: [
    {
      url: 'https://deunoposte.app.br/goias/',
      include: ['goias', 'look'],
      exclude: ['rio de janeiro', 'pt-rio', 'nacional']
    },
    {
      url: 'https://www.eojogodobicho.com/resultado-jogo-bicho-look-goias.html',
      include: ['look', 'goias'],
      exclude: ['rio de janeiro', 'pt-rio', 'nacional']
    }
  ],

  rio: [
    {
      url: 'https://deunoposte.app.br/rio-de-janeiro/',
      include: ['rio de janeiro', 'rio', 'pt-rio'],
      exclude: ['goias', 'look', 'nacional']
    },
    {
      url: 'https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/rj',
      include: ['rio', 'rj'],
      exclude: ['goias', 'look', 'nacional']
    }
  ],

  nacional: [
    {
      url: 'https://deunoposte.app.br/loteria-nacional/',
      include: ['nacional', 'loteria nacional'],
      exclude: ['rio de janeiro', 'pt-rio', 'look', 'goias']
    },
    {
      url: 'https://www.resultadofacil.com.br/resultados-loteria-nacional-de-hoje',
      include: ['nacional', 'loteria nacional'],
      exclude: ['rio de janeiro', 'pt-rio', 'look', 'goias']
    }
  ]
};
