const mongoose = require("mongoose");

const Party = mongoose.Schema({
  partyID: { 'type': String },
  players: {
    maitreBonBon: {
      playersID: { 'type': String, default: '' },

    },
    agentFbi: {
      playersID: { 'type': String, default: '' },

    },
    zero: {
      playersID: { 'type': String, default: '' },
      enigme: {
        ipMdp: {
          finish: { 'type': Boolean, default: false },
          ip: { 'type': String },   //générer aléatoirement mes en suivant la base de 192.168.X.X (oui c'est un ip local)
          mdp: { 'type': String }, ///générer aléatoirement
        },
        fireWall: {
          finish: { 'type': Boolean, default: false },
          directoryListing: { 'type': String, default: '/wp-content/uploads' }, // définie l'url à rentrer pour la faille
          SQLInjection: { 'type': String, default: `" OR 1 = 1 -- -` } //définir le code sql à rentrer
        },
        fileEncrypted: {
          finish: { 'type': Boolean, default: false },
          mdp: { 'type': String }, //générer aléatoirement
        },
        coordinate: {
          finish: { 'type': Boolean, default: false },
        }
      }
    }
  },
  software: {
    zero: {
      DDOS: { 'type': Boolean, default: false },
      webVulnerabilityScanner: { 'type': Boolean, default: false },
      decryptFile: { 'type': Boolean, default: false },
      webLookHtmlStructure: { 'type': Boolean, default: false },
    },
  },
  attackNow: [
    // liste des attaque en cours
  ],
  settings: {
    // pourras si pas flemme de le dev changer des trucs dans la partie
    start: { 'type': Boolean, default: false },
  },
  aide: {
    // liste des aide qui sont donée automatiquement (aide donée automatiquement après qu'il soit rester un certains moment sur une égnimes) temps à def par égnime
  }
})

module.exports = mongoose.model('Party', Party);