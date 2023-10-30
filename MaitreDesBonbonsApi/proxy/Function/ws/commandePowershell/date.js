const sendMessageUser = require("../sendMessageUser");

module.exports = async ({ userId, eventEmitter, command }) => {
  // récupère la date
  const date = new Date()

  // récupère les année
  const dateA = date.getFullYear()

  // récupère les mois
  const dateM = date.getMonth()

  // récupère les jours
  const dateJ = date.getDay()

  // mets les sous la forme h:m
  const messageReturn = `${dateJ}/${dateM}/${dateA}`

  // renvoie la réponse
  return sendMessageUser({
    message: {
      commandName: command.commandName,
      commandId: command.commandId,
      commandReturn: messageReturn
    },
    eventEmitter: eventEmitter,
    userId: userId,
    event: 'commandPowershell'
  }).catch((e) => {
    return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
  });
}