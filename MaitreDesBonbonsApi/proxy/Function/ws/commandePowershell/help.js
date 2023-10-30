const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')


module.exports = async ({ userId, eventEmitter, providedParams, command, commandZero }) => {
  if (providedParams.c) {
    // vérifie si la command existe
    if (!commandZero[providedParams.c]) {
      const responseString = `Cette commande n'est pas prise en charge par l'utilitaire d'aide.\nEssayer la commande 'HELP'`

      return sendMessageUser({
        message: {
          commandName: command.commandName,
          commandId: command.commandId,
          commandReturn: responseString
        },
        eventEmitter: eventEmitter,
        userId: userId,
        event: 'commandPowershell'
      }).catch((e) => {
        return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
      });
    }
    
    return sendMessageUser({
      message: {
        commandName: command.commandName,
        commandId: command.commandId,
        commandReturn: commandZero[providedParams.c].help.thisCommand
      },
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'commandPowershell'
    }).catch((e) => {
      return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
    });

  } else {

    // crée une boucle avec toute les commandes
    let responseStringEnd = ''

    Object.keys(commandZero).forEach((command) => {
      responseStringEnd = responseStringEnd + `${command} :   ${commandZero[command].help.global}\n`
    })

    const responseString = `Pour plus d\'informations sur une commande spécifique, entrez HELP -C suivi de la commande.\n${responseStringEnd}`

    return sendMessageUser({
      message: {
        commandName: command.commandName,
        commandId: command.commandId,
        commandReturn: responseString
      },
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'commandPowershell'
    }).catch((e) => {
      return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
    });
  }
}
