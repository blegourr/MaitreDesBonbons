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
	const ValideIp = isValideIp(providedParams.i)
	console.log(ValideIp);
}
