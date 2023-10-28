const sendMessagePool = require('./sendMessagePool')

/**
 * 
 * @param {Array[]} poolGlobal 
 * @param {EventEmitter} webSocketEmitter // voir pour l'importer autrement
 * @param {Number} poolId 
 * @param {String} message
 * @param {Number} userId
 * @param {Object} client
 */

module.exports = async ({ poolGlobal, poolId, message, webSocketEmitter, client, userId }) => {
  // vérification que les données transmisent existe

  if (!poolId || !message || !poolGlobal || !webSocketEmitter || ! client || !userId) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  // récupère la db
  const data = await client.getParty()
  // récupère notre partie
  const partyIndex = data.pool.findIndex(party => party.poolID === poolId)
  data.pool[partyIndex].settings.start = true

  // mets a jour la db
  await client.updateParty(data)

  // envoie la nouvelle db a tous les utilisateur
  const messageAllUserParty = JSON.stringify({
    type: 'StartGame',
    message: `Début de la partie`,
    json: JSON.stringify(data.pool[partyIndex])
  })

  sendMessagePool({
    poolGlobal: poolGlobal,
    poolId: poolId,
    message: messageAllUserParty,
    webSocketEmitter: webSocketEmitter,
    userId: userId
  })
}