const dotenv = require('dotenv');
const mongoose = require('mongoose');
const proxy = require('./proxy/proxy')


dotenv.config();

const mongOption = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}

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