const mongoose = require("mongoose");

const PartyAdmin = mongoose.Schema({
  partyID: { 'type': String },
  players: {
    maitreBonBon: {
    },
    agentFbi: {
    },
    zero: {
      ipMdp: {
        finish: { 'type': Boolean, default: false },
        ip: { 'type': String },   //générer aléatoirement mes en suivant la base de 192.168.X.X (oui c'est un ip local)
        mdp: { 'type': String }, ///générer aléatoirement
        domaine: { 'type': String }, // générer aléatoirement sous la forme x.x
        domaineToIp:  {
          type: Map,
          of: { 'type': String },
        },
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
  },
})

module.exports = mongoose.model('PartyAdmin', PartyAdmin);