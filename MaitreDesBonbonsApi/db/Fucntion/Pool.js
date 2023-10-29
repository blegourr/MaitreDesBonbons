const Pool = require('../Pool');
const FunctionDbUser = require('../../db/Fucntion/User')

// Fonction pour créer une pool
async function createPool(poolID, users = {}) {
  try {
    const pool = new Pool({
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
async function getPoolByPoolID(poolID) {
  try {
    const pool = await Pool.findOne({ poolID });
    return pool;
  } catch (error) {
    throw error;
  }
}

// Fonction pour mettre à jour une pool par son poolId
async function updatePoolByPoolID(poolId, updatedData) {
  try {
    const updatedPool = await Pool.findOneAndUpdate({ poolId }, updatedData, { new: true });
    return updatedPool;
  } catch (error) {
    throw error;
  }
}

// Fonction pour supprimer une pool par son poolId
async function deletePoolByPoolID(poolId) {
  try {
    await Pool.deleteOne({ poolId });
  } catch (error) {
    throw error;
  }
}

// Fonction pour vérifier si un utilisateur se trouve dans une piscine
async function isUserInAnyPool(userId) {
   try {
    const stringCherch = `users.${userId}.userId`
    const queryObject = {};
    queryObject[stringCherch] = userId;
    const pool = await Pool.findOne(queryObject);
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
async function getFirstAvailablePool() {
  try {
    const pools = await Pool.aggregate([
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
async function addUserToPool(poolId, userId, socketEmitUser) {
  try {
    // Recherchez la piscine par son poolId
    const pool = await Pool.findOne({ poolID: poolId });

    if (!pool) {
      // Si la piscine n'existe pas, vous pouvez prendre des mesures supplémentaires ici, par exemple, renvoyer une erreur.
      console.log('Piscine non trouvée :', poolId);
      return;
    }

    // Vérifiez le nombre d'utilisateurs dans la piscine
    if (pool.users.size < 3) {
      // récupère les donnée de l'utilisateur
      const user = await FunctionDbUser.getUserByUserID(userId)


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


module.exports = {
  createPool,
  getPoolByPoolID,
  updatePoolByPoolID,
  deletePoolByPoolID,
  isUserInAnyPool,
  getFirstAvailablePool,
  addUserToPool,
};
