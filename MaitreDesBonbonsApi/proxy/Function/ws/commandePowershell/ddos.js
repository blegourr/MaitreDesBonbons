const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')

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
	// vérifie si notre ip est valide
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
		const messageError = `Impossible d'effectuer une attaque DDoS : L'IP spécifiée (${providedParams.i}) ne peut pas être ciblée par une attaque DDoS.`

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

	// vérifie si le site est hs 
	if (partyAdmin.players.zero.ddos.inProgress) {
		// si oui renvoyée une erreur
		const messageError = `Le site demandé n'est pas en ligne. Par conséquent, l'exécution de l'action demandée est impossible. Veuillez vérifier l'IP ou réessayer ultérieurement.`

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

	// si non le faire crash et renvoyée le message
	partyAdmin.players.zero.ddos.inProgress = true

	FunctionDBPartyAdmin.updatepartyAdminBypartyID(partyID, partyAdmin).then(() => {
		const message = `L'attaque DDoS sur l'IP spécifiée (${providedParams.i}) a été exécutée avec succès. Les conséquences de cette opération ont entraîné un arrêt du serveur.`
		
		sendMessageUser({
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

		// attends 30s et repasse la valeur sur false pour simuler le relancement du site
		setTimeout(async () => {
			partyAdmin.players.zero.ddos.inProgress = true
			await FunctionDBPartyAdmin.updatepartyAdminBypartyID(partyID, partyAdmin)
		}, 30000)


	}).catch((error) => {
		const messageError = `Impossible d'effectuer une attaque DDoS erreur: \n${error}`

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
