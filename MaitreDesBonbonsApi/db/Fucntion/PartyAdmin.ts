import PartyAdminModel, { PartyAdminDocument } from '../PartyAdmin';

// Fonction pour créer une partyAdmin
export async function createPartyAdmin(partyID: string, initialData: any): Promise<any> {
  try {
    const partyAdmin = new PartyAdminModel({ partyID, ...initialData });
    const newPartyAdmin = await partyAdmin.save();
    return newPartyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer une partyAdmin par son partyID
export async function getPartyAdminByPartyID(partyID: string): Promise<any> {
  try {
    const partyAdmin = await PartyAdminModel.findOne({ partyID });
    return partyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une partyAdmin par son partyId
export async function updatePartyAdminByPartyID(partyId: string, updatedData: any): Promise<any> {
  try {
    const updatedPartyAdmin = await PartyAdminModel.findOneAndUpdate({ partyID: partyId }, updatedData, { new: true });
    return updatedPartyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une partyAdmin par son partyId
export async function deletePartyAdminByPartyID(partyId: string): Promise<void> {
  try {
    await PartyAdminModel.deleteOne({ partyID: partyId });
  } catch (error) {
    throw error;
  }
}

// Fonction pour ajouter des domaines à une partyAdmin
export async function addDomains(partyID: string, domaine: string, ip: string): Promise<any> {
  try {
    const partyAdmin = await PartyAdminModel.findOne({ partyID: partyID }) as PartyAdminDocument;

    if (!partyAdmin) {
      console.log('PartyAdmin non trouvée :', partyID);
      return;
    }

    partyAdmin.players.zero.ip.domaineToIp.set(domaine, ip);
    return await partyAdmin.save();
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}