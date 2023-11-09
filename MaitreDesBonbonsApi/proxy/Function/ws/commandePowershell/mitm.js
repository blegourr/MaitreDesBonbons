const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')
const FunctionDBParty = require('../../../../db/Fucntion/Party')


function isValidIp(string) {
	const splitString = string.split('.');

	if (splitString.length !== 4) return false;

	for (let i = 0; i < 4; i++) {
			const segment = parseInt(splitString[i]);
			if (isNaN(segment) || segment < 0 || segment > 255) {
					return false;
			}
	}

	return true;
}



module.exports = async ({ userId, eventEmitter, partyID, providedParams, command }) => {
  const ValideIp = isValidIp(providedParams.i)
	if (!ValideIp) {
		const messageError = `Erreur : L'adresse IP fournie n'est pas valide. Veuillez vérifier que vous avez entré une adresse IP correcte au format approprié (par exemple, 192.168.1.1). Assurez-vous que l'adresse IP est correcte et réessayez.`

		return sendMessageUser({
			message: {
				commandName: command.commandName,
				commandId: command.commandId,
				commandReturn: messageError
			},
			eventEmitter: eventEmitter,
			userId: userId,
			event: 'commandPowershell'
		}).catch((e) => {
			return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
		});
	}

	// récupère la party admin
  const partyAdmin = await FunctionDBPartyAdmin.getpartyBypartyAdminID(partyID)

  // vérifie si notre ip est la bonne
	if (providedParams.i !== partyAdmin.players.zero.ip.ip) {
		const messageError = `Impossible d'effectuer une attaque MITM : L'IP spécifiée (${providedParams.i}) ne peut pas être ciblée par une attaque MITM.`

		return sendMessageUser({
			message: {
				commandName: command.commandName,
				commandId: command.commandId,
				commandReturn: messageError
			},
			eventEmitter: eventEmitter,
			userId: userId,
			event: 'commandPowershell'
		}).catch((e) => {
			return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
		});
	}

  // vérifie si le serveur est "hs"
  if (!partyAdmin.players.zero.ddos.inProgress) {
    // si non dire que se n'est pas possible
    const messageError = `Échec de l'attaque MITM sur l'IP spécifiée (${providedParams.i}). L'état actuel du serveur ne permet pas d'effectuer cette opération.`

		return sendMessageUser({
			message: {
				commandName: command.commandName,
				commandId: command.commandId,
				commandReturn: messageError
			},
			eventEmitter: eventEmitter,
			userId: userId,
			event: 'commandPowershell'
		}).catch((e) => {
			return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
		});
  } 

  // si oui mettre le in Progress sur on
  partyAdmin.players.zero.mitm.inProgress === true

  // modifier la db et envoyées un réponse au client
  FunctionDBPartyAdmin.updatepartyAdminBypartyID(partyID, partyAdmin).then(() => {
		const message = `L'attaque MITM sur l'IP spécifiée (${providedParams.i}) a réussi, entraînant l'envoi des données vers l'URL indiquée dans la documentation.`
		
		return sendMessageUser({
			message: {
				commandName: command.commandName,
				commandId: command.commandId,
				commandReturn: message
			},
			eventEmitter: eventEmitter,
			userId: userId,
			event: 'commandPowershell'
		}).catch((e) => {
			return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
		});
	}).catch((error) => {
		const messageError = `Impossible d'effectuer une attaque MITM erreur: \n${error}`

		return sendMessageUser({
			message: {
				commandName: command.commandName,
				commandId: command.commandId,
				commandReturn: messageError
			},
			eventEmitter: eventEmitter,
			userId: userId,
			event: 'commandPowershell'
		}).catch((e) => {
			return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
		});
	})



}