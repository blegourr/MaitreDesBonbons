import * as PoolFunctions from '../../../db/Fucntion/Pool';
import { User } from "../../../db/Pool"

interface SendMessagePoolParams {
  userId: string;
  eventEmitter: any; // Remplacer 'any' par le type approprié si nécessaire
  poolId: string;
  message: any; // Remplacer 'any' par le type approprié si nécessaire
  event: string;
}

/**
 * Création de la fonction permettant d'envoyer un message à la pool
 * @param userId Identifiant de l'utilisateur
 * @param eventEmitter Émetteur d'événements
 * @param poolId Identifiant de la pool
 * @param message Message à envoyer
 * @param event Événement à émettre
 */
export default async function sendMessagePool({ userId, eventEmitter, poolId, message, event }: SendMessagePoolParams): Promise<void> {
  try {
    // Vérification de la présence des données nécessaires
    if (!userId || !poolId || !eventEmitter || !message || !event) {
      throw new Error('userID or poolId or eventEmitter or message or event is undefined');
    }

    // Récupération de la pool
    const pool = await PoolFunctions.getPoolByPoolID(poolId);
    
    // Vérification que la pool existe
    if (!pool) {
      throw new Error('poolID not found');
    }

    // Vérification si l'utilisateur se trouve dans la pool
    if (!pool.users.has(userId)) {
      throw new Error('Utilisateur ne se trouve pas dans cette pool');
    }

    // Envoi du message à tous les utilisateurs de la pool
    pool.users.forEach((user: User) => {
      if (!user.socketEmitUser) {
        throw new Error(`socketEmitUser not found for user ${user.userId}, in poolID: ${poolId}`);
      }

      try {
        // Envoi de l'événement WebSocket à l'utilisateur
        eventEmitter.emit(user.socketEmitUser, {
          message: message,
          event: event
        });
      } catch {
        throw new Error(`L'event ws n'existe pas pour l'utilisateur ${user.userId}`);
      }
    });
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}
