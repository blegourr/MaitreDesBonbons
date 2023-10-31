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
    }
  },
  software: {
    zero: {
      DDOS: { 'type': Boolean, default: false },
      metadata: { 'type': Boolean, default: false },
      MITM: { 'type': Boolean, default: false },
      urlFailShearch: { 'type': Boolean, default: false },
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
    zero: {

    }, 
    maitreBonBon: {

    },
    agentFbi: {
      
    }
  }
})

module.exports = mongoose.model('Party', Party);