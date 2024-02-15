import PoolModel from '../Pool';
import { getUserByUserID } from './User';

// Fonction pour créer une pool
export async function createPool(poolID: string, users: Record<string, any> = {}) {
  try {
    const pool = new PoolModel({
      poolID,
      users,
    });
    const newPool = await pool.save();
    return newPool;
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer une pool par son poolID
export async function getPoolByPoolID(poolID: string) {
  try {
    const pool = await PoolModel.findOne({ poolID });
    return pool;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une pool par son poolId
export async function updatePoolByPoolID(poolId: string, updatedData: Record<string, any>) {
  try {
    const updatedPool = await PoolModel.findOneAndUpdate({ poolId }, updatedData, { new: true });
    return updatedPool;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une pool par son poolId
export async function deletePoolByPoolID(poolId: string) {
  try {
    await PoolModel.deleteOne({ poolId });
  } catch (error) {
    throw error;
  }
}

// Fonction pour vérifier si un utilisateur se trouve dans une piscine
export async function isUserInAnyPool(userId: string) {
  try {
    const stringCherch = `users.${userId}.userId`;
    const queryObject: Record<string, any> = {};
    queryObject[stringCherch] = userId;
    const pool = await PoolModel.findOne(queryObject);
    if (pool) {
      return pool.poolID; // Retourne l'ID de la piscine si l'utilisateur est trouvé
    }
    return null; // Retourne null si l'utilisateur n'est pas trouvé
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
    return null; // En cas d'erreur, renvoie également null
  }
}

// Fonction pour renvoyer l'ID de la première piscine avec de la place
export async function getFirstAvailablePool() {
  try {
    const pools = await PoolModel.aggregate([
      {
        $addFields: {
          userCount: { $size: { $objectToArray: '$users' } },
        },
      },
      {
        $match: {
          $expr: { $lt: ['$userCount', 3] },
        },
      },
    ]);

    if (pools.length > 0) {
      return pools[0].poolID; // Renvoie l'ID de la première piscine avec de la place
    }
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

// Fonction pour ajouter un utilisateur à une piscine
export async function addUserToPool(poolId: string, userId: string, socketEmitUser: string) {
  try {
    // Recherchez la piscine par son poolId
    const pool = await PoolModel.findOne({ poolID: poolId });

    if (!pool) {
      // Si la piscine n'existe pas, vous pouvez prendre des mesures supplémentaires ici, par exemple, renvoyer une erreur.
      console.log('Piscine non trouvée :', poolId);
      return;
    }

    // Vérifiez le nombre d'utilisateurs dans la piscine
    if (pool.users.size < 3) {
      // récupère les données de l'utilisateur
      const user = await getUserByUserID(userId);

      if (!user) {
        throw new Error('Impossible de récupérer les informations de l\'utilisateur.'); 
      }

      // Ajoutez l'utilisateur à la piscine en utilisant la méthode set de la Map
      pool.users.set(userId, { userId: userId, avatar: user.avatar, name: user.name, socketEmitUser: socketEmitUser });

      // Enregistrez la piscine mise à jour dans la base de données
      console.log(`Utilisateur ${userId} ajouté à la piscine ${poolId}.`);
      return await pool.save();
    } else {
      // La piscine est complète, prenez des mesures supplémentaires si nécessaire
      console.log(`La piscine ${poolId} est complète.`);
    }
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}
