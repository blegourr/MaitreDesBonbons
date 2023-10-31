const mongoose = require("mongoose");

const PartyAdmin = mongoose.Schema({
  partyID: { 'type': String },
  players: {
    maitreBonBon: {
    },
    agentFbi: {
    },
    zero: {
      ip: {
        ip: { 'type': String },   //générer aléatoirement mes en suivant la base de 192.168.X.X (oui c'est un ip local)
        domaine: { 'type': String }, // générer aléatoirement sous la forme x.x
        domaineToIp: {
          type: Map,
          of: { 'type': String },
        },
      },
      mdpOfsession: {
        mdp: { 'type': String }, ///générer aléatoirement
        directoryListing: { 'type': String, default: '/wp-content/uploads' },
        file: [{ //récupérer un readme avec le mdp de la sessions de dans + des fichiers chiffré
          fileName: { 'type': String },
          filePath: { 'type': String },
          fileUrl: { 'type': String },
        }]
      },
      userOfSession: {
        SQLInjection: { 'type': String, default: `" OR 1 = 1 -- -` } //définir le code sql à rentrer parmis une list
      },
      fileOnSession: {
        access: { 'type': Boolean, default: false },
        file: [{ //récupérer des images des enfants
          fileName: { 'type': String },
          filePath: { 'type': String },
          fileUrl: { 'type': String },
          fileExtension: {'type': String},
        }]
      },
      ddos: {
        inProgress: { 'type': Boolean, default: false },
      },
      mitm: {
        inProgress: { 'type': Boolean, default: false },
        token:  { 'type': String }, ///générer aléatoirement
      },
      metadata: {
        mdp: { 'type': String }, ///générer aléatoirement
      },
      coordinate: {
        finish: { 'type': Boolean, default: false },
        coordinate: { 'type': String }, ///générer aléatoirement
      }
    }
  },
})

module.exports = mongoose.model('PartyAdmin', PartyAdmin);