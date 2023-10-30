const FucntionDbPool = require('../../../db/Fucntion/Pool')

/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 * @param {any} eventEmitter 
 */
module.exports = async ({ userId, eventEmitter, message, event }) => {
  if (!userId || !eventEmitter || !message || !event) {
    return console.error(`joinPool -> userID or poolId or eventEmitter or message or event is undefined`);
  }

  try {
    // envoie le ws pour l'utilisateurs
    eventEmitter.emit(`sendMessage_${userId}`, {
      message: message,
      event: event
    })
  } catch {
    return console.error(`L'event ws n'existe pas pour l'utilisateur ${userId}`)
  }
}