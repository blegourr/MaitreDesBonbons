const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')
const FunctionDBPartyAdmin = require('../../../db/Fucntion/PartyAdmin')
const FunctionPage = require('./urlRecherche/pageFunction')
const FunctionDbUser = require('../../../db/Fucntion/User')
const sendMessageUser = require('./sendMessageUser');

/**----------------------------------------------------
 *           Création des fonctions
 *-----------------------------------------------------
 */

/**
 * Remplace les placeholders dans l'URL par les valeurs spécifiques
 * @param {String} url - L'URL avec des placeholders
 * @param {Object} replacements - Les remplacements à effectuer
 * @returns {String} L'URL mise à jour
 */
function replacePlaceholders(url, replacements) {
  for (const placeholder in replacements) {
    if (replacements.hasOwnProperty(placeholder)) {
      const regex = new RegExp(replacements[placeholder], 'g');
      url = url.replace(regex, placeholder);
    }
  }
  return url;
}


const returnPageNotFound = () => {
  console.log('return');
}


/**----------------------------------------------------
 *  Création des listes des pages disponible avec leur url 
 *-----------------------------------------------------
 */
const urlPageZero = {
  home: {
    regex: /^\$domain\$\/$/g,
    require: {
      cookie: {
        access_token: /\$token\$$/g //regex de l'accès token
      },
      params: {}
    }, 
    function: FunctionPage.home,
  },

  login: {
    regex: /^\$domain\$\/login$/g,
    require: {
      cookie: {},
      params: {}
    },
    function: FunctionPage.login,
  },

  wpContent: {
    regex: /^\$domain\$\/wp-content\/uploads$/g,
    require: {
      cookie: {},
      params: {}
    },
    function: FunctionPage.wpContent,
  },

  wpContentReadme: {
    regex: /^\$domain\$\/wp-content\/uploads\/readme$/g,
    require: {
      cookie: {},
      params: {}
    },
    function: FunctionPage.wpContentReadme,
  },

  uploadsImg: {
    regex:/^\$domain\$\/api\/uploads\/img\/([^\/]+)\.([^\/]+)$/g,
    require: {
      cookie: {},
      params: {
        access_token: /\$token\$$/g //regex de l'accès token
      }
    },
    function: FunctionPage.uploadsImg,
  },
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
      urlLink: '',
      originalUrl: url,
    }

    // si l'url contient ce caractère $ bloquer la requête
    if (url.includes('$')) {
      return returnPageNotFound();
    }

    // vérifie si l'url commence par http ou https
    if (!url.startsWith('https://') && !url.startsWith('http://')) return returnPageNotFound()
    if (url.startsWith('https://')) {
      urlInfo.security = true
      url = url.replace('https://', '')
    } else {
      urlInfo.security = false
      url = url.replace('http://', '')
    }

    // vérifie si l'url commence par notre nom de domaine
    if (!url.startsWith(partyAdmin.players.zero.ip.domaine)) return returnPageNotFound()

    url = replacePlaceholders(url, {
      '$domain$': partyAdmin.players.zero.ip.domaine,
    });

    // vérifie l'URL avec l'expression régulière
    const matchedPage = Object.keys(urlPageZero).find(page => {
      const regex = new RegExp(urlPageZero[page].regex);
      return regex.test(url);
    });

    if (!matchedPage) {
      return returnPageNotFound();
    }


    // Vous pouvez maintenant utiliser pageDetails pour accéder aux détails de la page,
    // comme la page elle-même, les exigences, etc.
    const pageDetails = urlPageZero[matchedPage];
    console.log('Page trouvée:', matchedPage);
    console.log('Exigences:', pageDetails.require);

    urlInfo.urlLink = url

    return await pageDetails.function({
      pageDetails,
      partyAdmin,
      party,
      urlInfo,
      urlObject
    })
    
  } else {
    return returnPageNotFound();
  }
}