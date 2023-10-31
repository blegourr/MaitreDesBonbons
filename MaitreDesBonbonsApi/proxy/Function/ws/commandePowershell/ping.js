const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')





// Fonction pour générer une adresse IP locale aléatoire (192.168.X.X)
function generateRandomIPAddress() {
  const segment1 = 192;
  const segment2 = 168;
  const segment3 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  const segment4 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  return `${segment1}.${segment2}.${segment3}.${segment4}`;
}


module.exports = async ({ userId, eventEmitter, partyID, providedParams, command }) => {
  // message à renvoyer
  let string = `Envoi d'une requête 'ping' sur {D} [{ipOfSite}] avec 32 octets de données :\nDélai d'attente de la demande dépassé.\nRéponse de {ipOfSite} : temps=32 ms\nRéponse de {ipOfSite} : temps=34 ms\nRéponse de {ipOfSite} : temps=32 ms\nStatistiques Ping pour {ipOfSite}:\nPaquets : envoyés = 4, reçus = 3, perdus = 1 (perte 25%),\nDurée approximative des boucles en millisecondes :\nMinimum = 32ms, Maximum = 34ms, Moyenne = 32ms`

  // Vérifie si on récupère bien un nom de domaine
  const regex = /(\b\w+\.\w+\b)/;

  const matches = providedParams.d.match(regex);

  if (matches) {
    const premierDomaine = matches[0];
    // récupère la partie admin
    const partyAdmin = await FunctionDBPartyAdmin.getpartyBypartyAdminID(partyID)

    let ip = ''
    if (partyAdmin.players.zero.ipMdp.domaine === premierDomaine) {
      ip = partyAdmin.players.zero.ipMdp.ip
    } else {
      // vérifie si le nom de domaine à déjà été généré 
      const domaineregigster = premierDomaine.replace('.', '_')

      if (partyAdmin.players.zero.ipMdp.domaineToIp.has(domaineregigster)) {
        ip = partyAdmin.players.zero.ipMdp.domaineToIp.get(domaineregigster)
      } else {
        ip = generateRandomIPAddress()
        if (ip === partyAdmin.players.zero.ipMdp.ip) while (ip === partyAdmin.players.zero.ipMdp.ip) ip = generateRandomIPAddress()
        // mettre a jour pour ajouter notre nom de dommaine avec cette ip
        await FunctionDBPartyAdmin.addDomains(partyID, domaineregigster, ip)
      }
    }

    // simule un ping (remplace le {D} par le nom de domaine, et les {ipOfSite} par une id)
    string = string.replace('{D}', premierDomaine)

    let regex = new RegExp("{ipOfSite}", "g");
    string = string.replace(regex, ip);

    return sendMessageUser({
      message: {
        commandName: command.commandName,
        commandId: command.commandId,
        commandReturn: string
      },
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'commandPowershell'
    }).catch((e) => {
      return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
    });


  } else {
    const messageError = `Le nom de domaine ${providedParams.D} n'est pas valide`;
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
}
