const Party = require('../Party');

// Fonction pour créer une party
async function createparty(partyID) {
  try {
    const party = new Party({partyID});
    const newParty = await party.save();
    return newParty;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer une party par son partyID
async function getpartyBypartyID(partyID) {
  try {
    const party = await Party.findOne({ partyID });
    return party;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une party par son partyId
async function updatepartyBypartyID(partyId, updatedData) {
  try {
    const updatedparty = await Party.findOneAndUpdate({ partyID: partyId }, updatedData, { new: true });
    return updatedparty;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une party par son partyId
async function deletepartyBypartyID(partyId) {
  try {
    await Party.deleteOne({ partyId });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createparty,
  getpartyBypartyID,
  updatepartyBypartyID,
  deletepartyBypartyID,
};