const sendMessageUser = require("../sendMessageUser");
const FunctionDBPartyAdmin = require('../../../../db/Fucntion/PartyAdmin')
const FunctionDBParty = require('../../../../db/Fucntion/Party')


function isURLValid(url) {
  const pattern = new RegExp(/^[a-zA-Z0-9_-]+.(com|fr|org|io|eu|net)\/api\/uploads\/img\/[a-zA-Z0-9_-]+\.(webp|png|jpeg)(\?.*)?$/);

  return pattern.test(url);
}

function parseParamsFromURL(url) {
  // Découpez l'URL à partir du point d'interrogation pour obtenir la partie des paramètres.
  const paramsString = url.split('?')[1];

  if (!paramsString) {
    return {}; // Retourne un objet vide si aucun paramètre n'est présent.
  }

  // Divise la chaîne de paramètres en paires clé-valeur en utilisant le point-virgule comme séparateur.
  const paramPairs = paramsString.split(';');
  
  const params = {};

  // Boucle à travers les paires clé-valeur et les stocke dans un objet.
  for (const pair of paramPairs) {
    const [key, value] = pair.split('=');
    params[key] = value;
  }

  return params;
}


function extractImageNameFromURL(url) {
  // Utilisez un point d'interrogation comme séparateur pour extraire le chemin du fichier.
  const pathAndParams = url.split('?')[0];
  
  // Ensuite, utilisez le caractère '/' comme séparateur pour extraire le nom du fichier.
  const parts = pathAndParams.split('/');
  const imageName = parts[parts.length - 1];
  return imageName;
}



// function for verification if the token are egals
function stringEgals(string1, string2) {
  if (string1.length !== string2.length) {
    return false
  }

  for (let i = 0; i < string1.length; i++) {
    if (string1[i] !== string2[i]) {
      return false;
    }
  }

  return true;
}



module.exports = async ({ userId, eventEmitter, partyID, providedParams, command }) => {
  // vérifie si l'utilisateur peux utiliser cette commande
  const party = await FunctionDBParty.getpartyBypartyID(partyID)
  if (!party.software.zero.metadata) {
    const messageError = `'${command.commandName}' n'est pas reconnu en tant que commande interne \n ou externe, un programme exécutable ou un fichier de commandes.`

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

  // vérifie si l'url est valide mais sans vérifier le token
  const isValid = isURLValid(providedParams.l)

  if (!isValid) {
    const messageError = `Erreur 400 : L'URL que vous avez fournie n'est pas valide. Veuillez vous assurer que l'adresse que vous avez saisie est correcte et qu'elle respecte le format d'une URL standard (par exemple, example.com/api/uploads/img.exemple.webp). Si le problème persiste, veuillez vérifier l'URL et réessayer.`

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


  // récupération de la partyAdmin
  const partyAdmin = await FunctionDBPartyAdmin.getpartyBypartyAdminID(partyID)
  // vérifie le nom de domaine si c'est pas le bon renvoyée impossible d'accèder à la ressource demander, vérifie si l'img demander existe

  // récupère l'img demander 
  const imageNameURL = extractImageNameFromURL(providedParams.l)
  // vérifier si l'img existe dans la db
  const isExistImageName = partyAdmin.players.zero.fileOnSession.file.filter(file => `${file.fileName}${file.fileExtension}` === imageNameURL)
  console.log(isExistImageName);

  if (!providedParams.l.startsWith(partyAdmin.players.zero.ip.domaine) || !isExistImageName.length >= 1) {
    const messageError = `Erreur 404 : La ressource que vous recherchez est introuvable. Veuillez vérifier l'URL ou l'adresse que vous avez saisie et assurez-vous qu'elle est correcte. Si le problème persiste, contactez l'administrateur du site pour obtenir de l'aide.`

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


  // récupère les paramètres qui se trouve dans l'url
  const paramsURL = parseParamsFromURL(providedParams.l);
  console.log(paramsURL);
  // vérifie si le accèss_token est présent et valide  
  if (paramsURL.access_token.length !== partyAdmin.players.zero.mitm.token.length) {
    const messageError = `Erreur 403 : Accès refusé. Vous n'avez pas l'autorisation nécessaire pour accéder à cette image. Veuillez contacter l'administrateur du site ou le propriétaire de la ressource pour obtenir les autorisations appropriées.`

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
  
  //vérifie lettre par lettre si il sont égales
  if (stringEgals(paramsURL.access_token.toLowerCase().trim(), partyAdmin.players.zero.mitm.token.toLowerCase().trim())) {
    console.log(paramsURL.access_token.toLowerCase().trim(), partyAdmin.players.zero.mitm.token.toLowerCase().trim());
    const messageError = `Erreur 403 : Accès refusé. Vous n'avez pas l'autorisation nécessaire pour accéder à cette image. Veuillez contacter l'administrateur du site ou le propriétaire de la ressource pour obtenir les autorisations appropriées.`

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
  
  //à finnir
  // création du message à renvoyé
  const messageToReturn = `${partyAdmin.players.zero.metadata.mdp}`


  // renvoie des metadata
  return sendMessageUser({
    message: {
      commandName: command.commandName,
      commandId: command.commandId,
      commandReturn: messageToReturn,
    },
    eventEmitter: eventEmitter,
    userId: userId,
    event: 'commandPowershell'
  }).catch((e) => {
    return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse\n\nerreur -> \n`, e);
  });









}