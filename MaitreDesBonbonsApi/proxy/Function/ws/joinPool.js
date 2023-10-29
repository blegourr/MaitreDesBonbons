const FucntionDbPool = require('../../../db/Fucntion/Pool')
const FunctionDBParty = require('../../../db/Fucntion/Party')

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
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

/**
 * création de la function permettant de join la pool
 * @param {number} userId 
 */
module.exports = async ({ userId }) => {
  // vérification que les données nésésaire sont présente
  if ( !userId ) {
    return console.log(0);
  }

  // vérification si l'utilisateur se trouve dans une pool
  const UserInPool = await FucntionDbPool.isUserInAnyPool(userId)
  if (UserInPool) return console.log(`l'utilisateur est déjà dans une pool`)

  // vérifie si il reste de la place dans une pool
  const getFirstAvailablePool = await FucntionDbPool.getFirstAvailablePool()
  if (getFirstAvailablePool) {
    // faits rejoindre l'utilisateur
    return await FucntionDbPool.addUserToPool(getFirstAvailablePool, userId)
  }
  
  // crée la pool et la partie
  const initialUsers = new Map([[userId, { userId: userId }]])
  FucntionDbPool.createPool(Date.now(), initialUsers).then((newPool) => {
    console.log('Piscine créée avec succès :', newPool);
    // crée une partie avec le même Id
    FunctionDBParty.createparty(newPool.poolID).then((newPool) => {
      console.log('Party créée avec succès :', newPool);
    }).catch((error) => {
      console.error('Erreur lors de la création de la piscine :', error);
    });
  }).catch((error) => {
    console.error('Erreur lors de la création de la piscine :', error);
  });



  // envoie le message au autres utilisateurs 


  // // création du message à envoyer
  // const messageAllUser = JSON.stringify({
  //   type: 'UserJoin',
  //   message: users.filter(user => user.id === userId)[0]?.name ? `L'utilisateur ${users.filter(user => user.id === userId)[0].name} a rejoint votre groupe` : `Un utilisateur a rejoint votre groupe`,
  //   json: users
  // })
  // // envoie un message a tous les utilisateurs de la pool
  // sendMessagePool({
  //   poolGlobal: poolGlobal,
  //   poolId: poolId,
  //   message: messageAllUser,
  //   webSocketEmitter: webSocketEmitter,
  //   userId: userId
  // })


  // // crée un message revoyant la party
  // const messageAllUserParty = JSON.stringify({
  //   type: 'ModifDBParty',
  //   message: `modification de la party`,
  //   json: party
  // })

  // sendMessagePool({
  //   poolGlobal: poolGlobal,
  //   poolId: poolId,
  //   message: messageAllUserParty,
  //   webSocketEmitter: webSocketEmitter,
  //   userId: userId
  // })

  // return poolGlobal
}