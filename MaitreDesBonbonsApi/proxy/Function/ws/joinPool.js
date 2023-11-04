const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')
const FunctionDbUser = require('../../../db/Fucntion/User')
const FunctionDBPartyAdmin = require('../../../db/Fucntion/PartyAdmin')
const sendMessagePool = require('./sendMessagePool')

/**
 * création des fonction pour générer nos ip/mdp
 * @param {Number} length
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
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

// Fonction pour générer un nom de domaine aléatoire
function generateDomainName() {
  const extensions = ['.com', '.fr', '.org', '.io', '.eu', '.net'];
  
  // Génère une partie aléatoire pour le nom de domaine
  const randomString = Math.random().toString(36).substr(2);
  // Générer une sous-chaîne aléatoire de longueur comprise entre 3 et 8 caractères
  const randomLength = 3 + Math.floor(Math.random() * (8 - 3 + 1));
  const part = randomString.substr(0, randomLength);
  // const part = Math.random().toString(36).substr(2, 3);  
  
  // Sélectionne une extension de manière aléatoire parmi la liste donnée
  const extension = extensions[Math.floor(Math.random() * extensions.length)];
  
  // Combine la partie avec l'extension pour former le nom de domaine complet
  const domainName = `${part}${extension}`;
  
  return domainName;
}

function generateRandomUrlForImage() {
  const randomString = Math.random().toString(36).substring(2, 12); // Génère une chaîne aléatoire de 10 caractères
  const extensions = ['.webp', '.png', '.jpeg'];
  const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
    return {
      fileName: randomString,
      fileUrl: `/api/uploads/img/${randomString}${randomExtension}`,
      fileExtension: randomExtension
    };
}

function generateArrayWithRandomUrlForImage(number) {
  let array = []
  for (let i = 0; i <= number; i++) {
    array.push(generateRandomUrlForImage())
  }

  return array;
  // rajouter la filePath pour quand on aurras les images



  // /api/uploads/img/{randomImgFile}

  // { //récupérer des images des enfants
  //   fileName: { 'type': String },
  //   filePath: { 'type': String },
  //   fileUrl: { 'type': String },
  // }
}



/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 * @param {String} socketEmitUser
 * @param {any} eventEmitter
 */
module.exports = async ({ userId, socketEmitUser, eventEmitter }) => {
  // vérification que les données nésésaire sont présente
  new Promise(async (resolve, reject) => {
    if (!userId || !socketEmitUser || !eventEmitter) {
      console.error(`joinPool -> userID or socketEmitUser or eventEmitter is undefined`);
      return reject();
    }

    // vérification si l'utilisateur se trouve dans une pool
    const UserInPool = await FucntionDbPool.isUserInAnyPool(userId)
    if (UserInPool) {
      // console.log(`l'utilisateur est déjà dans une pool`)
      return resolve();
    }

    // vérifie si il reste de la place dans une pool
    const getFirstAvailablePool = await FucntionDbPool.getFirstAvailablePool()
    if (getFirstAvailablePool) {
      // faits rejoindre l'utilisateur
      await FucntionDbPool.addUserToPool(getFirstAvailablePool, userId, socketEmitUser)
      return resolve();
    }

    // récupère les information de l'utilisateur
    const user = await FunctionDbUser.getUserByUserID(userId)

    // crée la pool et la partie
    const initialUsers = new Map([[userId, { userId: userId, socketEmitUser: socketEmitUser, avatar: user.avatar, name: user.name }]])
    FucntionDbPool.createPool(Date.now(), initialUsers).then((newPool) => {
      // console.log('Piscine créée avec succès :', newPool);
      // crée une partie avec le même Id
      FunctionDBParty.createparty(newPool.poolID).then(() => {
        // console.log('Party créée avec succès :', newPool);

        // crée la zone avec les réponse
        FunctionDBPartyAdmin.createpartyAdmin(newPool.poolID, {
          partyID: newPool.poolID,
          players: {
            maitreBonBon: {},
            agentFbi: {},
            zero: {
              ip: {
                ip: generateRandomIPAddress(),  // générer aléatoirement mes en suivant la base de 192.168.X.X (oui c'est un ip local)
                domaine: generateDomainName(), //  générer aléatoirement sous la forme x.x
                domaineToIp: {},
              },
              mdpOfsession: {
                mdp: generateRandomPassword(64), //générer aléatoirement
                // directoryListing: { 'type': String, default: '/wp-content/uploads' },
                file: []
              },
              userOfSession: {
                // SQLInjection: { 'type': String, default: `" OR 1 = 1 -- -` } //définir le code sql à rentrer parmis une list
              },
              fileOnSession: {
                file: generateArrayWithRandomUrlForImage(5)
              },
              ddos: {},
              mitm: {
                token:  generateRandomPassword(64), //générer aléatoirement
              },
              metadata: {
                mdp: generateRandomPassword(64), //générer aléatoirement
              },
              coordinate: {
                // coordinate: { 'type': String }, //générer aléatoirement
              },
            }
          },
        }).then(() => {
          return resolve();
        }).catch((error) => {
          console.error('Erreur lors de la création de la partyAdmin :', error);
          return reject();
        });
      }).catch((error) => {
        console.error('Erreur lors de la création de la party :', error);
        return reject();
      });
    }).catch((error) => {
      console.error('Erreur lors de la création de la piscine :', error);
      return reject();
    });
  }).then(async () => {
    /*----------------------------------------------------
    *             envoie des messages à la pool
    *-----------------------------------------------------
    */

    // recupère la pool et la partie de l'utilisateur
    const UserPoolId = await FucntionDbPool.isUserInAnyPool(userId)
    const pool = await FucntionDbPool.getPoolByPoolID(UserPoolId)
    const party = await FunctionDBParty.getpartyBypartyID(UserPoolId)
    // envoie un message a tous les utilisateurs de la pool
    sendMessagePool({
      poolId: UserPoolId,
      message: pool,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'UserJoin'
    })


    // crée un message revoyant la party
    sendMessagePool({
      poolId: UserPoolId,
      message: party,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'ModifDBParty'
    })

    // return poolGlobal
  }).catch((e) => {
    console.error('une erreur c\'est produite -> \n', e)
  })
}