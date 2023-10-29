const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')
const FunctionDbUser = require('../../../db/Fucntion/User')
const sendMessagePool = require('./sendMessagePool')

/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 * @param {String} socketEmitUser
 * @param {any} eventEmitter
 */
module.exports = async ({ userId, partyID , eventEmitter }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !partyID || !eventEmitter) {
    return console.error(`joinPool -> userID or socketEmitUser or eventEmitter is undefined`);
  }

  // récupère la db  
  let party = await FunctionDBParty.getpartyBypartyID(partyID)


  // vérifie si les utilisateurs bien leur tous sélectionner un personnage



  // démare la partie
  party.settings.start = true

  // modifie la db
  const newParty = await FunctionDBParty.updatepartyBypartyID(partyID, party)

  // crée un message revoyant la party
  sendMessagePool({
    poolId: partyID,
    message: newParty,
    eventEmitter: eventEmitter,
    userId: userId,
    event: 'ModifDBParty'
  })
}