import { createPool, addUserToPool, getFirstAvailablePool, getPoolByPoolID, isUserInAnyPool } from '../../../db/Fucntion/Pool';
import { createParty, getPartyByPartyID } from '../../../db/Fucntion/Party';
import { getUserByUserID } from '../../../db/Fucntion/User';
import { createPartyAdmin } from '../../../db/Fucntion/PartyAdmin';
import sendMessagePool from './sendMessagePool';

interface JoinPoolParams {
  userId: string;
  socketEmitUser: string;
  eventEmitter: any; // Remplacer 'any' par le type approprié si nécessaire
}

/**
 * Création des fonctions pour générer nos IP/MDP
 * @param length Longueur
 */

// Fonction pour générer une adresse IP locale aléatoire (192.168.X.X)
function generateRandomIPAddress(): string {
  const segment1 = 192;
  const segment2 = 168;
  const segment3 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  const segment4 = Math.floor(Math.random() * 256); // Valeur aléatoire entre 0 et 255
  return `${segment1}.${segment2}.${segment3}.${segment4}`;
}

// Fonction pour générer un mot de passe aléatoire avec des caractères spéciaux
function generateRandomPassword(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

// Fonction pour générer un nom de domaine aléatoire
function generateDomainName(): string {
  const extensions = ['.com', '.fr', '.org', '.io', '.eu', '.net'];

  // Génère une partie aléatoire pour le nom de domaine
  const randomString = Math.random().toString(36).substr(2);
  // Générer une sous-chaîne aléatoire de longueur comprise entre 3 et 8 caractères
  const randomLength = 3 + Math.floor(Math.random() * (8 - 3 + 1));
  const part = randomString.substr(0, randomLength);

  // Sélectionne une extension de manière aléatoire parmi la liste donnée
  const extension = extensions[Math.floor(Math.random() * extensions.length)];

  // Combine la partie avec l'extension pour former le nom de domaine complet
  const domainName = `${part}${extension}`;

  return domainName;
}

function generateRandomUrlForImage(): { fileName: string, fileUrl: string, fileExtension: string } {
  const randomString = Math.random().toString(36).substring(2, 12); // Génère une chaîne aléatoire de 10 caractères
  const extensions = ['.webp', '.png', '.jpeg'];
  const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
  return {
    fileName: randomString,
    fileUrl: `/api/uploads/img/${randomString}${randomExtension}`,
    fileExtension: randomExtension
  };
}

function generateArrayWithRandomUrlForImage(number: number): Array<{ fileName: string, fileUrl: string, fileExtension: string }> {
  let array = []
  for (let i = 0; i < number; i++) {
    array.push(generateRandomUrlForImage())
  }

  return array;
}

/**
 * Création de la fonction permettant de rejoindre la pool
 * @param userId Identifiant de l'utilisateur
 * @param socketEmitUser Événement émis par le socket
 * @param eventEmitter Émetteur d'événements
 */
export default async function joinPool({ userId, socketEmitUser, eventEmitter }: JoinPoolParams): Promise<void> {
  try {
    // Vérification que les données nécessaires sont présentes
    if (!userId || !socketEmitUser || !eventEmitter) {
      throw new Error('userID or socketEmitUser or eventEmitter is undefined');
    }

    // Vérification si l'utilisateur se trouve dans une pool
    const userInPool = await isUserInAnyPool(userId);
    if (userInPool) {
      // L'utilisateur est déjà dans une pool
      return;
    }

    // Vérifie s'il reste de la place dans une pool
    const firstAvailablePool = await getFirstAvailablePool();
    if (firstAvailablePool) {
      // Fait rejoindre l'utilisateur à la pool
      await addUserToPool(firstAvailablePool, userId, socketEmitUser);
      return;
    }

    // Récupération des informations de l'utilisateur
    const user = await getUserByUserID(userId);

    if (!user) {
      throw new Error('Impossible de récupérer les informations de l\'utilisateur.'); 
    }

    // Crée la pool et la partie
    const initialUsers = new Map([[userId, { userId: userId, socketEmitUser: socketEmitUser, avatar: user.avatar, name: user.name }]]);
    const newPool = await createPool(Date.now().toString(), initialUsers);
    await createParty(newPool.poolID);
    await createPartyAdmin(newPool.poolID, {
      partyID: newPool.poolID,
      players: {
        maitreBonBon: {},
        agentFbi: {},
        zero: {
          ip: {
            ip: generateRandomIPAddress(),
            domaine: generateDomainName(),
            domaineToIp: {},
          },
          mdpOfsession: {
            mdp: generateRandomPassword(64),
            file: []
          },
          userOfSession: {},
          fileOnSession: {
            file: generateArrayWithRandomUrlForImage(5)
          },
          ddos: {},
          mitm: {
            token: generateRandomPassword(64),
          },
          metadata: {
            mdp: generateRandomPassword(64),
          },
          coordinate: {},
        }
      },
    });

    /* ----------------------------------------------------
    *             envoie des messages à la pool
    * -----------------------------------------------------
    */

    // Récupération de la pool et de la partie de l'utilisateur
    const userPoolId = await isUserInAnyPool(userId);

    if (!userPoolId) {
      throw new Error('Erreur pendant l\'ajoutde l\'utilisateur à la db');
    }

    const pool = await getPoolByPoolID(userPoolId);
    const party = await getPartyByPartyID(userPoolId);

    // Envoie un message à tous les utilisateurs de la pool
    sendMessagePool({
      poolId: userPoolId,
      message: pool,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'UserJoin'
    });

    // Crée un message renvoyant la party
    sendMessagePool({
      poolId: userPoolId,
      message: party,
      eventEmitter: eventEmitter,
      userId: userId,
      event: 'ModifDBParty'
    });

  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}
