const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

  const mongOption = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  }

  const client = {} // voir pour mettre le bot discord dedans

  const charger = async () => {
    await require('./db/Function')(client);
  }

  charger().then(() => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DATABASE_URI, mongOption).then(async () => {
      mongoose.Promise = global.Promise
      console.log('db connecter')
  

      // vérifie si une partie existe sinon la crée
      console.log(client)

      if (!await client.getParty()) {
        await client.createParty().then(() => {
          console.log('nouvelle party crée car il n\'en éxiste pas')
        }).catch((e) => {
          console.log(`une erreur est survenue pendant la création de la party: \n ${e}`)
        })
      }
  
  
    })
  })

  process.on('exit', code => { console.log(`le processus s'est arrêter avec comme erreur: ${code}!`) })
  process.on('uncaughException', (err, origin) => { console.log(`uncaughException: ${err}`, `Origine: ${origin} `) })
  process.on('unhandledRejection', (reason, promise) => { console.log(`unhandledRejection: ${reason}\n-----\n`, promise) })
  process.on('warning', (...args) => { console.log(...args) })