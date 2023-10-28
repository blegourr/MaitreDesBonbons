const sendMessagePool = require('./sendMessagePool')

/**
 * 
 * @param {Array[]} poolGlobal 
 * @param {EventEmitter} webSocketEmitter // voir pour l'importer autrement
 * @param {Number} poolId 
 * @param {Object} dataBaseModified
 * @param {Number} userId
 * @param {Object} client
 */

module.exports = async ({ poolGlobal, poolId, dataBaseModified, webSocketEmitter, client, userId }) => {
  // vérification que les données transmisent existe
  if (!poolId || !dataBaseModified || !poolGlobal || !webSocketEmitter || ! client || !userId) {
    return {
      error: true,
      message: 'params not found'
    }
  }
    
  // récupère la db
  const data = await client.getParty()
  // récupère notre partie
  const partyIndex = data.pool.findIndex(party => party.poolID === poolId)
  data.pool[partyIndex] = JSON.parse(dataBaseModified)

  // mets a jour la db
  await client.updateParty(data)

  // envoie la nouvelle db a tous les utilisateur
  const messageAllUserParty = JSON.stringify({
    type: 'ModifDBParty',
    message: `modification de la party`,
    json: dataBaseModified
  })

  sendMessagePool({
    poolGlobal: poolGlobal,
    poolId: poolId,
    message: messageAllUserParty,
    webSocketEmitter: webSocketEmitter,
    userId: userId
  })
}