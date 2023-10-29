const User = require('../User'); // Importez le modèle d'utilisateur

// Fonction pour créer un utilisateur
async function createUser(userID, userData = {}) {
  try {
    const user = new User({
      userId: userID,
      ...userData,
    });
    const newUser = await user.save();
    return newUser;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer un utilisateur par son userID
async function getUserByUserID(userID) {
  try {
    const user = await User.findOne({ userId: userID });
    return user;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour un utilisateur par son userID
async function updateUserByUserID(userID, updatedData) {
  try {
    const updatedUser = await User.findOneAndUpdate({ userId: userID }, updatedData, { new: true });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer un utilisateur par son userID
async function deleteUserByUserID(userID) {
  try {
    await User.deleteOne({ userId: userID });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByUserID,
  updateUserByUserID,
  deleteUserByUserID,
};
