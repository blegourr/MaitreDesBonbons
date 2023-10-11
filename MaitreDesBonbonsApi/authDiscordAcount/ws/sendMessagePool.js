/**
 * 
 * @param {Array[]} poolGlobal 
 * @param {EventEmitter} webSocketEmitter // voir pour l'importer autrement
 * @param {Number} poolId 
 * @param {String || Object} message 
 */

module.exports = ({ poolGlobal, poolId, message, webSocketEmitter, userId }) => {
  // vérification que les données transmisent existe
  if (!poolId || !message || !poolGlobal || !webSocketEmitter || !userId) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  // récupère la pool
  const pool = poolGlobal[poolGlobal.findIndex(room => room.poolId === poolId)];
  // vérifie que la pool existe
  if (!pool) {
    return {
      error: true,
      message: 'poolID not found'
    }
  }

  // vérifie si l'utilisateur se trouve dans cette pool
  if (pool.users.forEach((user) => user.id === userId)) {
    return {
      error: true,
      message: 'Utilisateur ne se trouve pas dans cette pool'
    }
  }
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