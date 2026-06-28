const bichos = {
  1:'Avestruz',2:'Águia',3:'Burro',4:'Borboleta',5:'Cachorro',6:'Cabra',7:'Carneiro',8:'Camelo',9:'Cobra',10:'Coelho',
  11:'Cavalo',12:'Elefante',13:'Galo',14:'Gato',15:'Jacaré',16:'Leão',17:'Macaco',18:'Porco',19:'Pavão',20:'Peru',
  21:'Touro',22:'Tigre',23:'Urso',24:'Veado',25:'Vaca'
};
function dezenaDaMilhar(milhar){ return String(milhar).padStart(4,'0').slice(-2); }
function grupoDaDezena(dezena){ const d = Number(dezena); return d === 0 ? 25 : Math.ceil(d / 4); }
function normalizarMilhar(v){ return String(v).replace(/\D/g,'').padStart(4,'0').slice(-4); }
function analisar(resultados){
  const total = resultados.length;
  const groups = {}, dezenas = {}, lastSeen = {};
  for(let g=1; g<=25; g++){ groups[g]=0; lastSeen[g]=9999; }
  resultados.forEach((r,idx)=>{
    groups[r.grupo] = (groups[r.grupo]||0)+1;
    dezenas[r.dezena] = (dezenas[r.dezena]||0)+1;
    if(lastSeen[r.grupo]===9999) lastSeen[r.grupo]=idx;
  });
  const rankedGroups = Object.keys(groups).map(g=>{
    const freq = total ? groups[g]/total : 0;
    const atraso = Math.min(lastSeen[g], 50)/50;
    const recent = resultados.slice(0,20).filter(r=>r.grupo==g).length / Math.max(1, Math.min(20,total));
    const score = Math.round((freq*45 + atraso*30 + recent*25)*100);
    return {grupo:Number(g), bicho:bichos[g], freq:groups[g], atraso:lastSeen[g]===9999?'Nunca':lastSeen[g], score};
  }).sort((a,b)=>b.score-a.score);
  const rankedDezenas = Object.keys(dezenas).map(d=>({dezena:d, freq:dezenas[d], score:Math.round((dezenas[d]/total)*1000)})).sort((a,b)=>b.score-a.score);
  const lateGroups = [...rankedGroups].sort((a,b)=>(b.atraso==='Nunca'?999:b.atraso)-(a.atraso==='Nunca'?999:a.atraso));
  return {rankedGroups, rankedDezenas, lateGroups};
}
function gerarMilhares(rankedGroups, rankedDezenas){
  const dezenasBase = rankedDezenas.length ? rankedDezenas.slice(0,10).map(x=>x.dezena) : rankedGroups.slice(0,10).flatMap(g=>[String(g.grupo*4-3).padStart(2,'0'),String(g.grupo*4).padStart(2,'0')]);
  return dezenasBase.slice(0,6).map((d,i)=> `${(Number(d)*37+i*11)%100}`.padStart(2,'0') + d);
}
