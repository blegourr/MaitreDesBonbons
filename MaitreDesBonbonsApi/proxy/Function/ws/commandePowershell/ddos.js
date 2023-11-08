const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')

function isValideIp(string) {
	const splitString = string.split('.')

	if (splitString.lenght !== 4) return false
	for (let i = 0; i <= 4; i++) {
		if (isNaN(splitString[i])) return false
	}
	return true
}


module.exports = async ({ userId, eventEmitter, partyID, providedParams, command }) => {
	// vérifie si notre ip est valide
	const ValideIp = isValideIp(providedParams.i)
	console.log(ValideIp);
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

	}



	// si non le faire crash et renvoyée le message 


}
