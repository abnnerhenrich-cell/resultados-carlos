let activeLottery = 'look';
const key = () => `jb_resultados_${activeLottery}`;
const $ = id => document.getElementById(id);
document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>{document.querySelector('.tab.active').classList.remove('active');btn.classList.add('active');activeLottery=btn.dataset.lottery;render();});
$('date').valueAsDate = new Date();
$('addResult').onclick = () => {
  const milhar = normalizarMilhar($('milhar').value); if(!milhar) return alert('Digite a milhar.');
  const dezena = dezenaDaMilhar(milhar); const grupo = grupoDaDezena(dezena);
  const item = {date:$('date').value,time:$('time').value||'--',position:Number($('position').value||1),milhar,dezena,grupo,bicho:bichos[grupo],createdAt:Date.now()};
  const data = load(); data.unshift(item); save(data); $('milhar').value=''; render();
};
$('clearData').onclick=()=>{ if(confirm('Limpar o histórico desta loteria?')){localStorage.removeItem(key());render();} };
$('loadSample').onclick=()=>{ save(sampleData(activeLottery)); render(); };
function load(){ return JSON.parse(localStorage.getItem(key())||'[]'); }
function save(data){ localStorage.setItem(key(), JSON.stringify(data)); }
function render(){
  const data = load(); $('lastUpdate').textContent = data[0] ? new Date(data[0].createdAt).toLocaleString('pt-BR') : '--';
  const tbody = $('history'); tbody.innerHTML = data.map(r=>`<tr><td>${r.date}</td><td>${r.time}</td><td>${r.position}º</td><td>${r.milhar}</td><td>${r.dezena}</td><td>${String(r.grupo).padStart(2,'0')}</td><td>${r.bicho}</td></tr>`).join('');
  if(!data.length){ ['ranking','topGroups','topDezenas','lateGroups'].forEach(id=>$(id).innerHTML='<p class="empty">Sem dados ainda.</p>'); return; }
  const a = analisar(data); const milhares = gerarMilhares(a.rankedGroups,a.rankedDezenas);
  $('ranking').innerHTML = a.rankedGroups.slice(0,5).map((g,i)=>`<div class="item"><span>${i+1}º Grupo ${String(g.grupo).padStart(2,'0')} - ${g.bicho}<br><small>freq: ${g.freq} | atraso: ${g.atraso}</small></span><b class="score">${g.score}%</b></div>`).join('') + `<h3>Milhares sugeridas</h3><p>${milhares.join(' • ')}</p>`;
  $('topGroups').innerHTML = a.rankedGroups.slice(0,8).map(g=>`<div class="item"><span>${String(g.grupo).padStart(2,'0')} ${g.bicho}</span><strong>${g.freq}x</strong></div>`).join('');
  $('topDezenas').innerHTML = a.rankedDezenas.slice(0,8).map(d=>`<div class="item"><span>Dezena ${d.dezena}</span><strong>${d.freq}x</strong></div>`).join('');
  $('lateGroups').innerHTML = a.lateGroups.slice(0,8).map(g=>`<div class="item"><span>${String(g.grupo).padStart(2,'0')} ${g.bicho}</span><strong>${g.atraso}</strong></div>`).join('');
}
function sampleData(type){
 const base = type==='look' ? ['4579','6425','9683','1181','5896','1470','4107','1740','7041','9525','2770','0888','2105','7025','4544'] : ['8381','6440','3888','7818','0467','5020','0861','2662','2163','4464','0369','2770','4515','2105','9229'];
 return base.map((m,i)=>{const milhar=normalizarMilhar(m), dezena=dezenaDaMilhar(milhar), grupo=grupoDaDezena(dezena);return{date:new Date(Date.now()-i*86400000).toISOString().slice(0,10),time:['09h','11h','14h','16h','18h','21h'][i%6],position:(i%5)+1,milhar,dezena,grupo,bicho:bichos[grupo],createdAt:Date.now()-i*3600000};});
}
render();
