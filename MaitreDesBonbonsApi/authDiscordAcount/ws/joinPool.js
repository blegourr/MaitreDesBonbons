
/**
 * 
 * @param {any[]} pools 
 * @param {number} userId 
 * @param {number} poolId 
 * @param {*} ws 
 * @param {string} message 
 */
module.exports = async (pools, userId, poolId, ws, message) => {
    // rajoute lé création de la partie
    if (!pools[poolId]) {
        pools[poolId] = {
          users: [],
        };
  
        let db = await client.getParty()
  
        if (db.pool.filter(pool => pool.poolID === poolId).length >= 1) {
          db.pool[db.pool.findIndex(pool => pool.poolID === poolId)[0]] = {
            poolID: poolId,
            players: {
              maitreBonBon: {
                playersID: 'undefined',
  
              },
              agentFbi: {
                playersID: 'undefined',
  
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
  
      if (!pools[poolId].users.some(user => user.id === userId)) {
        pools[poolId].users.push({
          id: userId,
          ws: ws
        });
      }
  
      return pools[poolId].users
}