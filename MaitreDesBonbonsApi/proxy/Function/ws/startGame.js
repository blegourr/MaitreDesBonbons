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
module.exports = async ({ userId, partyID, eventEmitter }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !partyID || !eventEmitter) {
    return console.error(`startGame -> userID or partyID or eventEmitter is undefined`);
  }

  // récupère la db  
  let party = await FunctionDBParty.getpartyBypartyID(partyID)

  // vérifie que l'utilisateur se trouve bien dans la pool
  let poolId = await FucntionDbPool.isUserInAnyPool(userId)
  if (poolId !== partyID) {
    return console.error(`startGame -> l'utilisateur veut modifier une pool dans la qu'elle il n'y est pas`);
  }

  //vérifie si les utilisateurs bien leur tous sélectionner un personnage
  if (!party.players.zero.playersID || !party.players.agentFbi.playersID || !party.players.maitreBonBon.playersID) {
    return console.error(`startGame -> impossible de lancer la partie, tous les personnages n'ont pas été sélectioné`);
  }

  // démare la partie
  party.settings.start = true

  // modifie la db
  FunctionDBParty.updatepartyBypartyID(partyID, party).then(newParty => {
    // crée un message revoyant la party
    sendMessagePool({
      poolId: partyID,
      message: newParty,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'ModifDBParty'
    })
  }).catch((e) => {
    return console.error(`startGame -> une erreur c'est produite lors de la modification de la party\n\nerreur -> \n`, e);
  })

}