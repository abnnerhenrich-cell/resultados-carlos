{
  "name": "sistema-analise-jb-functions",
  "version": "1.0.0",
  "main": "index.js",
  "engines": { "node": "20" },
  "scripts": { "serve": "firebase emulators:start --only functions", "deploy": "firebase deploy --only functions" },
  "dependencies": {
    "axios": "^1.7.9",
    "cheerio": "^1.0.0",
    "firebase-admin": "^12.7.0",
    "firebase-functions": "^6.1.2"
  }
}
