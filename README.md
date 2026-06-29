# JB Análise Automática

Projeto pronto para GitHub + Firebase, sem instalar nada no computador.

## Já configurado
- Projeto Firebase: `carlos-resutados`
- App Web Firebase em `public/firebase.js`
- Painel Rio / Look Goiás / Nacional
- Leitura do Firestore
- GitHub Actions para publicar o site
- GitHub Actions para coletar resultados a cada 30 minutos

## O que você precisa fazer
1. Enviar todos estes arquivos para um repositório no GitHub.
2. Criar uma chave de conta de serviço no Firebase/Google Cloud.
3. Salvar essa chave no GitHub com o nome `FIREBASE_SERVICE_ACCOUNT`.
4. Rodar as Actions: `Publicar site no Firebase` e `Coletar resultados`.

## Aviso
O coletor usa fontes públicas configuradas em `functions/fontes.js`. Se algum site mudar o HTML, a URL ou o parser pode precisar de ajuste.

Análise estatística não garante acerto futuro.
