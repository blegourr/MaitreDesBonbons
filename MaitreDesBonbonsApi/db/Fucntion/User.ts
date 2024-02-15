// const User = require('../User'); // Importez le modèle d'utilisateur
import User from '../User'


// Fonction pour créer un utilisateur
export async function createUser(userID: string, userData = {}) {
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
export async function getUserByUserID(userID: string) {
  try {
    const user = await User.findOne({ userId: userID });
    return user;
  } catch (error) {
    return false;
  }
}

// Fonction pour mettre à jour un utilisateur par son userID
export async function updateUserByUserID(userID: string, updatedData: any) {
  try {
    const updatedUser = await User.findOneAndUpdate({ userId: userID }, updatedData, { new: true });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer un utilisateur par son userID
export async function deleteUserByUserID(userID: string) {
  try {
    await User.deleteOne({ userId: userID });
  } catch (error) {
    throw error;
  }
}