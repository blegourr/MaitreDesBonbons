/**
 * 
 * @param {Array[]} poolGlobal 
 * @param {EventEmitter} webSocketEmitter // voir pour l'importer autrement
 * @param {Number} poolId 
 * @param {String || Object} message 
 */

module.exports = async ({ poolGlobal, poolId, message, webSocketEmitter, userId, client }) => {
  // vérification que les données transmisent existe
  if (!poolId || !message || !poolGlobal || !webSocketEmitter || !userId || ! client) {
    return {
      error: true,
      message: 'params not found'
    }
  }
    
  // récupère la db
  const data = await client.getParty()
  // récupère notre partie
  const partyIndex = data.pool.findIndex(party => party.poolID === poolId)
  console.log(partyIndex);

  // exécute le code pour tous les utilisateurs
  pool.users.forEach((user) => {
    // récupère le nom de l'évent
    const ws = user.ws

    if (!ws) {
      return {
        error: true,
        message: `ws not found for user ${user.id}, in poolID: ${poolId}`
      }
    }

    try {
      // envoie le ws pour l'utilisateurs
      webSocketEmitter.emit(ws, {
        message: message
      })
    } catch {
      return {
        error: true,
        message: `L'event ws n'existe pas pour l'utilisateur ${user.id}`
      }
    }
  })
}