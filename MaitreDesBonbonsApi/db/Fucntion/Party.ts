import PartyModel from '../Party';

// Fonction pour créer une party
export async function createParty(partyID: string): Promise<any> {
  try {
    const party = new PartyModel({ partyID });
    const newParty = await party.save();
    return newParty;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer une party par son partyID
export async function getPartyByPartyID(partyID: string): Promise<any> {
  try {
    const party = await PartyModel.findOne({ partyID });
    return party;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une party par son partyId
export async function updatePartyByPartyID(partyId: string, updatedData: any): Promise<any> {
  try {
    const updatedParty = await PartyModel.findOneAndUpdate({ partyID: partyId }, updatedData, { new: true });
    return updatedParty;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une party par son partyId
export async function deletePartyByPartyID(partyId: string): Promise<void> {
  try {
    await PartyModel.deleteOne({ partyID: partyId });
  } catch (error) {
    throw error;
  }
}
