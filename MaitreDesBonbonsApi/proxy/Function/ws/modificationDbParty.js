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
    return console.error(`modificationDbParty -> userID or dataBaseModified or eventEmitter is undefined`);
  }

  // vérifie que l'utilisateur se trouve bien dans la pool
  let poolId = await FucntionDbPool.isUserInAnyPool(userId)
  if (poolId !== dataBaseModified.partyID) {
    return console.error(`modificationDbParty -> l'utilisateur veut modifier une pool dans la qu'elle il n'y est pas`);
  }


  // récupère la db
  await FunctionDBParty.updatepartyBypartyID(dataBaseModified.partyID, dataBaseModified)
  
  
  FunctionDBParty.getpartyBypartyID(dataBaseModified.partyID).then((newParty) => {
    // crée un message revoyant la party
    sendMessagePool({
      poolId: dataBaseModified.partyID,
      message: newParty,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'ModifDBParty'
    })
  }).catch((e) => {
    return console.error(`modificationDbParty -> une erreur c'est produite lors de la modification de la party\n\nerreur -> \n`, e);
  })
}