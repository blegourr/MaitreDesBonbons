const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')
const FunctionDBPartyAdmin = require('../../../db/Fucntion/PartyAdmin')
const FunctionDbUser = require('../../../db/Fucntion/User')
const sendMessageUser = require('./sendMessageUser');

/**----------------------------------------------------
 *           Création des fonctions
 *-----------------------------------------------------
 */
// récupération des paramètres dans une url
 function getParams(url) {
  const paramsObject = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    const paramsArray = queryString.split('&');
    
    paramsArray.forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        paramsObject[key] = decodeURIComponent(value);
      }
    });
  }

  return paramsObject;
}




const returnPageNotFound = () => {

}


/**----------------------------------------------------
 *  Création des listes des pages disponible avec leur url 
 *-----------------------------------------------------
 */
const urlPageZero = {
  $domain$: {
    page: 'home',
    require: {
      access_token: {
        Veref: '$token$',
        params: false
      }
    }
  },
  '$domain$/login': {
    page: 'login',
    require: {}
  },
  '$domain$/wp-content/uploads': {
    page: 'wpContent',
    require: {}
  },
  '$domain$/wp-content/uploads/readme': {
    page: 'wpContentReadme',
    require: {}
  },
  '$domain$/api/uploads/img': {
    page: 'uploads/img',
    require: {
      access_token: {
        Veref: '$token$',
        params: true
      }
    },
    startsWith: true,
    regex: ''
  }
}

/**----------------------------------------------------
 *                       CODE
 *-----------------------------------------------------
 */
/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 * @param {String} socketEmitUser
 * @param {any} eventEmitter
 */
module.exports = async ({ userId, urlObject, eventEmitter, partyID }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !urlObject || !eventEmitter || !partyID) {
    return console.error(`urlRecherche -> userID or command or eventEmitter or partyID is undefined`);
  }
  // récupère la db  
  let party = await FunctionDBParty.getpartyBypartyID(partyID)

  // vérifie que l'utilisateur se trouve bien dans la pool
  let poolId = await FucntionDbPool.isUserInAnyPool(userId)
  if (poolId !== partyID) {
    return console.error(`urlRecherche -> l'utilisateur veut accéder a une page dans une pool où il n'y est pas`);
  }

  // vérifie le personnage de l'utilisateur
  if (party.players.agentFbi.playersID === userId) {
    return console.error(`urlRecherche -> l'utilisateur veut accéder a une page mais sont personnages ne le permets pas -> agentFbi`);
  }

  if (party.players.maitreBonBon.playersID === userId) {
    return console.error(`urlRecherche -> l'utilisateur veut accéder a une page mais sont personnages ne le permets pas -> maitreBonBon`);
  }

  if (party.players.zero.playersID === userId) {
    let partyAdmin = await FunctionDBPartyAdmin.getpartyBypartyAdminID(partyID)
    let url = urlObject.url.trim().toLowerCase()
    let urlInfo = {
      security: undefined,
      params: [],
    }

    // vérifie si l'url commence par http ou https
    if (!url.startsWith('https://') && !url.startsWith('http://')) returnPageNotFound()
    
    if (url.startsWith('https://')) {
      urlInfo.security = true
      url.split('https://')[0]
    } else {
      urlInfo.security = false
      url.split('http://')[0]
    }
    

    // vérifie si l'url commence par notre nom de domaine
    if (!url.startsWith(partyAdmin.players.zero.ip.domaine)) returnPageNotFound()
    
    url.replace(partyAdmin.players.zero.ip.domaine, '$domain$')


    // vérifie si l'url à des params
    const paramsUrl = getParams(url)

    // vérifie si l'access_token est valide
    if (paramsUrl.access_token && paramsUrl.access_token !== partyAdmin.players.zero.mitm.token) {
      paramsUrl.access_token = ''
    }


  }
}