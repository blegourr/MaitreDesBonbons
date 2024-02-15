import { isUserInAnyPool } from '../../../db/Fucntion/Pool';
import { getPartyByPartyID, updatePartyByPartyID } from '../../../db/Fucntion/Party';
import sendMessagePool from './sendMessagePool';

interface ChoicePersonageParams {
  userId: string;
  partyID: string;
  personageSelec: string;
  eventEmitter: any; // Remplacer 'any' par le type approprié si nécessaire
}

/**
 * Création de la fonction permettant de rejoindre une pool
 * @param userId Identifiant de l'utilisateur
 * @param partyID Identifiant de la partie
 * @param personageSelec Personnage sélectionné
 * @param eventEmitter Émetteur d'événements
 */
export default async function choicePersonage({ userId, partyID, personageSelec, eventEmitter }: ChoicePersonageParams): Promise<void> {
  // Vérification que les données nécessaires sont présentes
  if (!userId || !partyID || !personageSelec || !eventEmitter) {
    return console.error(`choicePersonage -> userID or partyID or personageSelec or eventEmitter is undefined`);
  }

  // Vérifie que l'utilisateur se trouve bien dans la pool
  const poolId = await isUserInAnyPool(userId);
  if (poolId !== partyID) {
    return console.error(`choicePersonage -> l'utilisateur veut modifier une pool dans laquelle il n'est pas`);
  }

  // Vérifie que la partie n'est pas lancée
  const party = await getPartyByPartyID(partyID);
  if (party.settings.start) {
    return console.error(`choicePersonage -> l'utilisateur ne peut pas changer de personnage pendant la partie`);
  }

  // Vérifie si ce personnage existe
  if (!party.players[personageSelec]) {
    return console.error(`choicePersonage -> l'utilisateur a sélectionné un personnage qui n'existe pas`);
  }

  // Vérifie si le personnage n'est pas déjà sélectionné
  if (party.players[personageSelec].playersID && party.players[personageSelec].playersID !== userId) {
    return console.error(`choicePersonage -> l'utilisateur ne peut pas changer de personnage quand celui-ci est déjà sélectionné`);
  }

  // Modifie la partie pour sélectionner le bon personnage
  if (party.players[personageSelec].playersID) {
    party.players[personageSelec].playersID = '';
  } else {
    if (party.players.maitreBonBon.playersID === userId) {
      party.players.maitreBonBon.playersID = '';
    }

    if (party.players.agentFbi.playersID === userId) {
      party.players.agentFbi.playersID = '';
    }

    if (party.players.zero.playersID === userId) {
      party.players.zero.playersID = '';
    }

    party.players[personageSelec].playersID = userId;
  }

  // Modifie la partie
  updatePartyByPartyID(partyID, party)
    .then((newParty) => {
      // Crée un message renvoyant la party
      sendMessagePool({
        poolId: partyID,
        message: newParty,
        eventEmitter: eventEmitter,
        userId: userId,
        event: 'ModifDBParty'
      });
    })
    .catch((e) => {
      return console.error(`choicePersonage -> une erreur s'est produite lors de la modification de la party\n\nerreur -> \n`, e);
    });
}
