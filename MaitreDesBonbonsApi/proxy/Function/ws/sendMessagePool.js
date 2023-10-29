const FucntionDbPool = require('../../../db/Fucntion/Pool')

/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 * @param {any} eventEmitter 
 */
module.exports = async ({ userId, eventEmitter, poolId, message, event }) => {
  if (!userId || !poolId || !eventEmitter || !message || !event) {
    return console.error(`joinPool -> userID or poolId or eventEmitter or message or event is undefined`);
  }

  const pool = await FucntionDbPool.getPoolByPoolID(poolId)
  // vérifie que la pool existe
  if (!pool) {
    return console.error(`poolID not found`);
  }

  if (pool.users[userId]) {
    return console.error(`Utilisateur ne se trouve pas dans cette pool`);
  }

  pool.users.forEach((user) => {
    if (!user.socketEmitUser) {
      return console.error(`socketEmitUser not found for user ${user.id}, in poolID: ${poolId}`)
    }

    try {
      // envoie le ws pour l'utilisateurs
      eventEmitter.emit(user.socketEmitUser, {
        message: message,
        event: event
      })
    } catch {
      return console.error(`L'event ws n'existe pas pour l'utilisateur ${user.id}`)
    }
  })
}