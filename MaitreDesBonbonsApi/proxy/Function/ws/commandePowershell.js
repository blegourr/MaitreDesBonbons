const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')
const FunctionDbUser = require('../../../db/Fucntion/User')
const sendMessageUser = require('./sendMessageUser');
const ping = require('./commandePowershell/ping');
const time = require('./commandePowershell/time');
const date = require('./commandePowershell/date');

/**----------------------------------------------------
 *           Création des fonctions
 *-----------------------------------------------------
 */


function parseCommandString(commandString) {
  const params = {};
  const paramRegex = /-(\w+) ([^\s-]+)/g;
  let match;

  while ((match = paramRegex.exec(commandString)) !== null) {
    const paramName = match[1];
    const paramValue = match[2];
    params[paramName] = paramValue;
  }

  return params;
}

/**----------------------------------------------------
 *           Création des listes de commande
 *-----------------------------------------------------
 */

 const commandZero = {
  // ddos: {
  //   help: {
  //   global: '',
  //   thisCommand: ''
  //   },
  //   params: {},
  // },
  // scanneurwebfail: {
  //   help: {
  //   global: '',
  //   thisCommand: ''
  //   },
  //   params: {},
  // },
  // scanneurwebstructure: {
  //   help: {
  //   global: '',
  //   thisCommand: ''
  //   },
  //   params: {},
  // },
  ping: {
    help: {
      global: 'Ping un nom de dommain',
      thisCommand: '',
    },
    params: {
      d: {
      require: true
      }
    }, 
  },
  // bruteforce: {
  //   help: {
  //   global: '',
  //   thisCommand: ''
  //   },
  //   params: {},
  // },
  help: {
    help: {
      global: '',
      thisCommand: ''
    },
    params: {
      c: {
        require: false
      }
    },
  },
  time: {
    help: {
      global: 'Time renvoie l\'heure',
      thisCommand: 'Time renvoie l\'heure sous le forma HH:MM'
    },
  },
  date: {
    help: {
      global: 'Date renvoie la date',
      thisCommand: 'Date renvoie la date sous le forma jj/mm/aa'
    },
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
module.exports = async ({ userId, command, eventEmitter, partyID }) => {
  // vérification que les données nésésaire sont présente
  if (!userId || !command || !eventEmitter || !partyID) {
    return console.error(`commandePowershell -> userID or command or eventEmitter or partyID is undefined`);
  }

  // récupère la db  
  let party = await FunctionDBParty.getpartyBypartyID(partyID)

  // vérifie que l'utilisateur se trouve bien dans la pool
  let poolId = await FucntionDbPool.isUserInAnyPool(userId)
  if (poolId !== partyID) {
    return console.error(`commandePowershell -> l'utilisateur veut exécuter une commande dans une pool où il n'y est pas`);
  }

  // vérifie le personnage de l'utilisateur
  if (party.players.agentFbi.playersID === userId) {
    return console.error(`commandePowershell -> l'utilisateur veut exécuter une commande mais sont personnages ne le permets pas -> agentFbi`);
  }

  if (party.players.maitreBonBon.playersID === userId) {
    return console.error(`commandePowershell -> l'utilisateur veut exécuter une commande mais sont personnages ne le permets pas -> maitreBonBon`);
  }

  if (party.players.zero.playersID === userId) {

    // vérifie si la commande existe
    if (!commandZero[command.commandName.toLowerCase()]) {
      // crée le message d'erreur quand la commande n'existe pas
      const messageError = `'${command.commandName}' n'est pas reconnu en tant que commande interne \n ou externe, un programme exécutable ou un fichier de commandes.`
      // envoie le message d'erreur a l'utilisateur
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
        return console.error(`commandePowershell -> une erreur c'est produite lors de l'envoie de la réponse'\n\nerreur -> \n`, e);
      })
    }

  let providedParams
    // Vérifie si la commande a des paramètres
  if (commandZero[command.commandName.toLowerCase()].params) {
    const expectedParams = commandZero[command.commandName.toLowerCase()].params;
    providedParams = parseCommandString(command.command.toLowerCase());

    // Vérifie les paramètres
    const missingParams = Object.keys(expectedParams).filter((paramName) => {
      return expectedParams[paramName].require && !providedParams[paramName]
    });
    
    if (missingParams.length > 0) {
      const missingParamsNames = missingParams.join(', ');
      const messageError = `La commande '${command.commandName}' nécessite les paramètres suivants :  ${missingParamsNames}`;
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


    // éxécution des commandes
    if (command.commandName.toLowerCase() === 'ping') {
      ping({ userId, eventEmitter, partyID, providedParams, command })
    }
    if (command.commandName.toLowerCase() == 'time') {
      time({ userId, eventEmitter, command })
    }
    if (command.commandName.toLowerCase() == 'date') {
      date({ userId, eventEmitter, command })
    }

  
  }
}