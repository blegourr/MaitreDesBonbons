const dotenv = require('dotenv');
const mongoose = require('mongoose');
const proxy = require('./proxy/proxy')


dotenv.config();

const mongOption = {}; // Définition initiale d'un objet vide

// Configuration des options de connexion à MongoDB
mongOption.autoIndex = false; // Ne pas construire d'index automatiquement
mongOption.maxPoolSize = 10; // Maintenir jusqu'à 10 connexions simultanées
mongOption.serverSelectionTimeoutMS = 5000; // Durée maximale pour sélectionner le serveur (en millisecondes)
mongOption.socketTimeoutMS = 45000; // Durée maximale d'inactivité avant de fermer la connexion (en millisecondes)
mongOption.family = 4; // Utiliser IPv4 (ignorer IPv6)

// Le reste de votre code


const client = {} // voir pour mettre le bot discord dedans



mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URI, mongOption).then(async () => {
  mongoose.Promise = global.Promise
  console.log('db connecter')


  // vérifie si une partie existe sinon la crée
  proxy.start()

}).catch((e) => {
  //problème de connection db
  console.error(`connection DB échoué raison: ${e}`)
})

process.on('exit', code => { console.log(`le processus s'est arrêter avec comme erreur: ${code}!`) })
process.on('uncaughException', (err, origin) => { console.log(`uncaughException: ${err}`, `Origine: ${origin} `) })
process.on('unhandledRejection', (reason, promise) => { console.log(`unhandledRejection: ${reason}\n-----\n`, promise) })
process.on('warning', (...args) => { console.log(...args) })