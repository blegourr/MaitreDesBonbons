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
 * 
 * @param {any[]} poolGlobal 
 * @param {number} userId 
 * @param {number} poolId 
 * @param {*} ws 
 * @param {string || Object} message 
 * @param {Object} client
 */
module.exports = async ({poolGlobal, userId, poolId, ws, message, client}) => {

  // vérification que les données nésésaire sont présente
  if (!poolGlobal || !userId || !poolId || !ws || !message || !client) {
    return {
      error: true,
      message: 'params not found'
    }
  }


    // vérifie si la pool Existe
    if (!poolGlobal[poolId]) {
      // création de la pool

    }



    if (!poolGlobal[poolId]) {
        poolGlobal[poolId] = {
          users: [],
        };
  
        let db = await client.getParty()
  
        if (db.pool.filter(pool => pool.poolID === poolId).length >= 1) {
          db.pool[db.pool.findIndex(pool => pool.poolID === poolId)[0]] = {
            poolID: poolId,
            players: {
              maitreBonBon: {
                playersID: '',
  
              },
              agentFbi: {
                playersID: '',
  
              },
              zero: {
                playersID: 'undefined',
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
          }
  
          await client.updateParty(db)      
        } else {
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
      }
  
      if (!poolGlobal[poolId].users.some(user => user.id === userId)) {
        poolGlobal[poolId].users.push({
          id: userId,
          ws: ws
        });
      }
  
      return poolGlobal[poolId].users
}