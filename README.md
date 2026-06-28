# JB Análise Automática

Sistema para GitHub + Firebase com painel Rio, Look Goiás e Nacional.

## O que vem pronto
- Site em `public/`
- Firebase Hosting
- Firestore
- Cloud Functions agendada a cada 30 minutos
- Coletor configurável em `functions/fontes.js`
- Resultado do 1º ao 5º prêmio
- Análise estatística: grupos fortes, dezenas fortes, atrasados e milhares sugeridas

## Antes de subir
1. Edite `.firebaserc` e troque `COLE_AQUI_O_ID_DO_SEU_PROJETO` pelo ID do projeto Firebase.
2. Edite `public/firebase.js` e cole o `firebaseConfig` do seu app Web.
3. Envie todos os arquivos para o GitHub.

## Deploy depois no Firebase
```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

## Teste manual da coleta
Depois do deploy, abra:
`https://SEU-SITE.web.app/coletarAgora`

## Fontes
As fontes ficam em `functions/fontes.js`. Se algum site mudar o HTML, troque a URL ali.

Importante: este sistema gera análise estatística. Não garante resultado futuro.
