import { isUserInAnyPool } from '../../../db/Fucntion/Pool';
import { updatePartyByPartyID, getPartyByPartyID } from '../../../db/Fucntion/Party';
import sendMessagePool from './sendMessagePool';

interface ModificationDbPartyParams {
  userId: string;
  dataBaseModified: any; // Remplacer 'any' par le type approprié si nécessaire
  eventEmitter: any; // Remplacer 'any' par le type approprié si nécessaire
}

/**
 * Création de la fonction permettant de modifier la base de données de la party
 * @param userId Identifiant de l'utilisateur
 * @param dataBaseModified Base de données modifiée
 * @param eventEmitter Émetteur d'événements
 */
export default async function modificationDbParty({ userId, dataBaseModified, eventEmitter }: ModificationDbPartyParams): Promise<void> {
  // Vérification que les données nécessaires sont présentes
  if (!userId || !dataBaseModified || !eventEmitter) {
    return console.error(`modificationDbParty -> userID or dataBaseModified or eventEmitter is undefined`);
  }

  // Vérifie que l'utilisateur se trouve bien dans la pool
  const poolId = await isUserInAnyPool(userId);
  if (poolId !== dataBaseModified.partyID) {
    return console.error(`modificationDbParty -> l'utilisateur veut modifier une pool dans laquelle il n'est pas`);
  }

  // Récupère la base de données
  await updatePartyByPartyID(dataBaseModified.partyID, dataBaseModified);

  getPartyByPartyID(dataBaseModified.partyID)
    .then((newParty) => {
      // Crée un message renvoyant la party
      sendMessagePool({
        poolId: dataBaseModified.partyID,
        message: newParty,
        eventEmitter: eventEmitter,
        userId: userId,
        event: 'ModifDBParty'
      });
    })
    .catch((e) => {
      return console.error(`modificationDbParty -> une erreur s'est produite lors de la modification de la party\n\nerreur -> \n`, e);
    });
}
