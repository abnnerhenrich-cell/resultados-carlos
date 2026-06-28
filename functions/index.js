const {onSchedule}=require('firebase-functions/v2/scheduler');
const {onRequest}=require('firebase-functions/v2/https');
const admin=require('firebase-admin');const fontes=require('./fontes');const{coletarDeFontes}=require('./scraperGenerico');
admin.initializeApp();const db=admin.firestore();
const NOMES={rio:'Rio / PT-Rio',look:'Look Goiás',nacional:'Nacional'};
async function salvar(r){const id=`${r.loteria}_${r.data}_${String(r.horario).replace(/\W/g,'')}`;await db.collection('resultados').doc(id).set(r,{merge:true});return id}
async function coletarUma(loteria){const r=await coletarDeFontes(loteria,NOMES[loteria],fontes[loteria]);await salvar(r);return r}
async function coletarTodas(){const saida={ok:[],erros:[]};for(const loteria of ['rio','look','nacional']){try{const r=await coletarUma(loteria);saida.ok.push({loteria:r.loteria,data:r.data,horario:r.horario,fonte:r.fonte})}catch(e){saida.erros.push({loteria,erro:e.message})}}return saida}
exports.coletarResultados=onSchedule({schedule:'every 30 minutes',timeZone:'America/Sao_Paulo'},async()=>{console.log(await coletarTodas())});
exports.coletarAgora=onRequest(async(req,res)=>{res.set('Access-Control-Allow-Origin','*');try{res.json(await coletarTodas())}catch(e){res.status(500).json({erro:e.message})}});
