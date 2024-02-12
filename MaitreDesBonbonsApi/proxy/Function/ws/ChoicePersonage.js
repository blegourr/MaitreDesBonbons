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
module.exports = async ({ userId, partyID, personageSelec, eventEmitter }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !partyID || !personageSelec || !eventEmitter) {
    return console.error(`choicePersonage -> userID or partyID or personageSelec or eventEmitter is undefined`);
  }

  // vérifie que l'utilisateur se trouve bien dans la pool
  let poolId = await FucntionDbPool.isUserInAnyPool(userId)
  if (poolId !== partyID) {
    return console.error(`choicePersonage -> l'utilisateur veut modifier une pool dans la qu'elle il n'y est pas`);
  }

  // vérifie que la partie n'est pas lancer
  let party = await FunctionDBParty.getpartyBypartyID(partyID)
  if (party.settings.start) {
    return console.error(`choicePersonage -> l'utilisateur ne peut pas changer de personnage pendant la partie`);
  }

  // vérifie si ce personnage existe
  if (!party.players[personageSelec]) {
    return console.error(`choicePersonage -> l'utilisateur à sélectionner un personnage qui n'existe pas`);
  }

  // vérifie si le personnage n'est pas déjà sélectionner
  if (party.players[personageSelec].playersID && party.players[personageSelec].playersID !== userId ) {
    return console.error(`choicePersonage -> l'utilisateur ne peut pas changer de personnage quand celui ci est déjà sélectionner`);
  }

  // modifie la partie pour sélectionner le bon personage
  if (party.players[personageSelec].playersID) {
    party.players[personageSelec].playersID = ''
  } else {
    if (party.players.maitreBonBon.playersID === userId) {
      party.players.maitreBonBon.playersID = ''
    }

    if (party.players.agentFbi.playersID === userId) {
      party.players.agentFbi.playersID = ''
    }

    if (party.players.zero.playersID === userId) {
      party.players.zero.playersID = ''
    }

    party.players[personageSelec].playersID = userId
  }

  // modifie la partie
  FunctionDBParty.updatepartyBypartyID(partyID, party).then((newParty) => {
    // crée un message revoyant la party
    sendMessagePool({
      poolId: partyID,
      message: newParty,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'ModifDBParty'
    })
  }).catch((e) => {
    return console.error(`choicePersonage -> une erreur c'est produite lors de la modification de la party\n\nerreur -> \n`, e);
  })
}