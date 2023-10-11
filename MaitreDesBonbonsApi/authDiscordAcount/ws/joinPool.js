/**
   * création des fonction pour générer nos ip/mdp
   * 
   */

// Fonction pour générer une adresse IP locale aléatoire (192.168.X.X)
function generateRandomIPAddress() {
  const segment1 = 192;
  const segment2 = 168;
  const segment3 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  const segment4 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  return `${segment1}.${segment2}.${segment3}.${segment4}`;
}

// Fonction pour générer un mot de passe aléatoire avec des caractères spéciaux
function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

/**
 * création de la function pour crée la pool
 * @param {Array} poolGlobal
 * @param {Number} poolId
 * @returns {Array} poolGlobal
 */
const poolCreation = ({ poolGlobal, poolId }) => {
  if (!poolGlobal || !poolId) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  if (isNaN(poolId)) {
    return {
      error: true,
      message: 'poolId is not a number'
    }
  }

  let pool = poolGlobal[poolId]

  if (!pool) {
    // crée la pool
    poolGlobal[poolId] = {
      users: [],
    };
  }

  return poolGlobal
}

/**
 * 
 * @param {Array} poolGlobal 
 * @param {Number} poolId
 * @param {Number} userId
 * @param {String} ws
 * @returns poolGlobal
 */
const poolAddUser = ({ poolGlobal, poolId, userId, ws }) => {
  if (!poolGlobal || !poolId || !userId || !ws) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  if (isNaN(poolId)) {
    return {
      error: true,
      message: 'poolId is not a number'
    }
  }

  let pool = poolGlobal[poolId]
  if (!pool) {
    return {
      error: true,
      message: 'pool not found'
    }
  }

  // vérifie si l'utilisateur est déjà dans la pool
  if (!pool.users.some(user => user.id === userId)) {

    // rajoute l'utilisateur dans la pool
    pool.users.push({
      id: userId,
      ws: ws
    });
  }

  return poolGlobal
}



/**
 * function permetant la création de la party pour la pool adéquatte
 * @param {Number} poolId 
 * @param {Object} client
 * @returns {object} db
 */
const creationPartyForPool = async ({ poolId, client }) => {
  if (!client || !poolId) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  if (isNaN(poolId)) {
    return {
      error: true,
      message: 'poolId is not a number'
    }
  }

  //récupère la db
  let db = await client.getParty()

  // vérifie si la party existe déjà pour la pool
  if (db.pool.filter(pool => pool.poolID === poolId).length < 1) {
    db.pool.push({
      poolID: poolId,
      players: {
        maitreBonBon: {
          playersID: '',

        },
        agentFbi: {
          playersID: '',

        },
        zero: {
          playersID: '',
          enigme: {
            ipMdp: {
              finish: false,
              ip: generateRandomIPAddress(),
              mdp: generateRandomPassword(64),
            },
            fireWall: {
              finish: false,
              directoryListing: '/wp-content/uploads', // définie l'url à rentrer pour la faille
              SQLInjection: " OR 1 = 1 -- - " //définir le code sql à rentrer
            },
            fileEncrypted: {
              finish: false,
              mdp: generateRandomPassword(64)
            },
            coordinate: {
              finish: false,
            }
          }
        }
      },
      software: {
        DDOS: false,
        webVulnerabilityScanner: false,
        decryptFile: false,
        webLookHtmlStructure: false,
      },
      attackNow: [],
      settings: {},
      aide: {}
    })

    await client.updateParty(db)
  }

  return db
}


/**
 * création de la function permettant de join la pool
 * @param {any[]} poolGlobal 
 * @param {number} userId 
 * @param {number} poolId 
 * @param {String} ws 
 * @param {string || Object} message 
 * @param {Object} client
 */
module.exports = async ({ poolGlobal, userId, poolId, ws, message, client }) => {

  // vérification que les données nésésaire sont présente
  if (!poolGlobal || !userId || !poolId || !ws || !message || !client) {
    return {
      error: true,
      message: 'params not found'
    }
  }

  // création de la pool
  poolGlobal = poolCreation({
    poolGlobal: poolGlobal,
    poolId: poolId,
  })


  // rajout de l'utilisateur dans la pool
  poolGlobal = poolAddUser({
    poolGlobal: poolGlobal,
    poolId: poolId,
    userId: userId,
    ws: ws
  })

  // création de la party dans la db
  let db = creationPartyForPool({
    poolId: poolId,
    client: client
  })


  return db
}