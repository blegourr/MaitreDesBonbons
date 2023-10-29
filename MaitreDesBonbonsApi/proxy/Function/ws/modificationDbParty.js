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
module.exports = async ({ userId, dataBaseModified, eventEmitter }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !dataBaseModified || !eventEmitter) {
    return console.error(`joinPool -> userID or socketEmitUser or eventEmitter is undefined`);
  }

  // récupère la db
  await FunctionDBParty.updatepartyBypartyID(dataBaseModified.partyID, dataBaseModified)
  
  
  const newParty = await FunctionDBParty.getpartyBypartyID(dataBaseModified.partyID)
  // crée un message revoyant la party
  sendMessagePool({
    poolId: dataBaseModified.partyID,
    message: newParty,
    eventEmitter: eventEmitter,
    userId: userId,
    event: 'ModifDBParty'
  })
}