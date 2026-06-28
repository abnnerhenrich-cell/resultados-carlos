export const BICHOS=["Avestruz","Águia","Burro","Borboleta","Cachorro","Cabra","Carneiro","Camelo","Cobra","Coelho","Cavalo","Elefante","Galo","Gato","Jacaré","Leão","Macaco","Porco","Pavão","Peru","Touro","Tigre","Urso","Veado","Vaca"];
export function grupoPorDezena(dezena){let d=Number(dezena); if(d===0)d=100; return Math.ceil(d/4)}
export function bichoPorGrupo(grupo){return BICHOS[Number(grupo)-1]||""}
export function normalizarPremio(posicao,milhar,bicho,grupo){const m=String(milhar||"").replace(/\D/g,"").padStart(4,"0").slice(-4);const dezena=m.slice(-2);const centena=m.slice(-3);const g=grupo?String(grupo).padStart(2,"0"):String(grupoPorDezena(dezena)).padStart(2,"0");return{posicao:Number(posicao),milhar:m,centena,dezena,grupo:g,bicho:bicho||bichoPorGrupo(g)}}
