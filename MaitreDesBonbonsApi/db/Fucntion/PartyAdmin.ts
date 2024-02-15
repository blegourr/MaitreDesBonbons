const PartyAdmin = require('../PartyAdmin');

// Fonction pour créer une partyAdmin
async function createpartyAdmin(partyID, initialData) {
  try {
    const partyAdmin = new PartyAdmin({ partyID, ...initialData });
    const newPartyAdmin = await partyAdmin.save();
    return newPartyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer une partyAdmin par son partyID
async function getpartyBypartyAdminID(partyID) {
  try {
    const partyAdmin = await PartyAdmin.findOne({ partyID });
    return partyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une partyAdmin par son partyId
async function updatepartyAdminBypartyID(partyId, updatedData) {
  try {
    const updatedpartyAdmin = await PartyAdmin.findOneAndUpdate({ partyID: partyId }, updatedData, { new: true });
    return updatedpartyAdmin;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une partyAdmin par son partyId
async function deletepartyAdminBypartyID(partyId) {
  try {
    await PartyAdmin.deleteOne({ partyId });
  } catch (error) {
    throw error;
  }
}

async function addDomains(partyID, domaine, ip) {
  try {
    // Recherchez la piscine par son partyID
    const partyAdmin = await PartyAdmin.findOne({ partyID: partyID });

    if (!partyAdmin) {
      // Si la piscine n'existe pas, vous pouvez prendre des mesures supplémentaires ici, par exemple, renvoyer une erreur.
      console.log('PartyAdmin non trouvée :', partyID);
      return;
    }


    // Ajoutez l'utilisateur à la piscine en utilisant la méthode set de la Map
    partyAdmin.players.zero.ip.domaineToIp.set(domaine, ip);

    // Enregistrez la piscine mise à jour dans la base de données
    return await partyAdmin.save();
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

module.exports = {
  createpartyAdmin,
  getpartyBypartyAdminID,
  updatepartyAdminBypartyID,
  deletepartyAdminBypartyID,
  addDomains,
};