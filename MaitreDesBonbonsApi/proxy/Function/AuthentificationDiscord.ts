import { Request, Response, NextFunction } from 'express';
const importDynamic = new Function('modulePath', 'return import(modulePath)');

const fetch = async (...args:any[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
};// const FunctionDBModificationUser = require('../../db/Fucntion/User')

/**----------------------------------------------------
 *                     CONFIG
 *-----------------------------------------------------
 */
require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_CALLBACK_URL;

// création des interfaces
interface DiscordUser {
  id: string;
  message: number;
  global_name: String;
  avatar: String;
}

interface DiscordToken {
  access_token: String;
}



/**----------------------------------------------------
 *  création de la fonction de vérification du token
 *-----------------------------------------------------
*/
export async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): Promise<Boolean> {
  // Vérifiez la validité du token Discord ici  
  const accessToken = req.cookies['access_token'];
  if (!accessToken) {
    res.status(401);
    res.redirect('/errorLogin');
    return false
  }

  try {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    // Analyse de la réponse JSON avec une double assertion de type
    const user: DiscordUser = await userResponse.json() as DiscordUser;

    // Vérification des propriétés nécessaires
    if (!user || !user.id) {
      throw new Error('Invalid user data');
    }

    return true;
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401);
    res.redirect('/errorLogin');
    return false
  }

  next();
}


export async function verifyToken(accessToken: string) {
  // Vérifiez la validité du token Discord ici
  if (!accessToken) {
    return console.error(`accessToken undefined`)
  }

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user data');
  }

  const user: DiscordUser = await userResponse.json() as DiscordUser;

  if (!user || !user.id) {
    return console.error(`accessToken unvaible`)
  }

  return user
};



/**----------------------------------------------------
 *      création de la fonction d'authentification
 *-----------------------------------------------------
 */
//  export async function authDiscordAcount(req: Request, res: Response, next: NextFunction): Promise<void> {
//   // récupère le code d'authentification présents dans l'url de la page
//   const code = req.query.code;
//   if (!code) {console.error(`erreur système authDiscordAcount #&d`, 1);
//     return res.redirect('/errorLogin');
//   }

//   const body = new URLSearchParams();
//   body.append('client_id', CLIENT_ID || '');
//   body.append('client_secret', CLIENT_SECRET || '');
//   body.append('code', typeof code === 'string' ? code : '');
//   body.append('grant_type', 'authorization_code');
//   body.append('redirect_uri', REDIRECT_URI || '');
//   body.append('scope', 'identify email');

//   // Échangez le code d'authentification contre le token_access Discord.
//   const response = await fetch('https://discord.com/api/oauth2/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: body.toString(),
//   });

//   if (!response) {console.error(`erreur système authDiscordAcount #&d`, 2);
//     return res.redirect('/errorLogin');
//   }

//   if (!response.ok) {
//     throw new Error('Failed to fetch user data');
//   }

//   const data: DiscordToken = await response.json() as DiscordToken;
//   if (!data) {console.error(`erreur système authDiscordAcount #&d`, 3);
//     return res.redirect('/errorLogin');
//   }

//   const accessToken = data.access_token;
//   if (!accessToken) {console.error(`erreur système authDiscordAcount #&d`, 4);
//     return res.redirect('/errorLogin');
//   }

//   // Utilisez l'accessToken pour obtenir les informations de l'utilisateur depuis l'API Discord
//   const userResponse = await fetch('https://discord.com/api/users/@me', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (!userResponse) {console.error(`erreur système authDiscordAcount #&d`, 5);
//     return res.redirect('/errorLogin');
//   }

//   if (!userResponse.ok) {
//     throw new Error('Failed to fetch user data');
//   }

//   const user: DiscordUser = await userResponse.json() as DiscordUser;


//   if (!user || user.message === 401) {console.error(`erreur système authDiscordAcount #&d`, 6);
//     return res.redirect('/errorLogin');
//   }

//   // vérifie si l'utilisateur se trouve dans la db si oui modifie le pour mettre à jour ces donnée sinon crée le
//   const UserFound = await FunctionDBModificationUser.getUserByUserID(user.id)
//   if (!UserFound) {
//     FunctionDBModificationUser.createUser(user.id, {
//       name: user.global_name,
//       avatar: user.avatar,
//     })
//   }

//   FunctionDBModificationUser.updateUserByUserID(user.id, {
//     name: user.global_name,
//     avatar: user.avatar,
//   })

//   // génère les cookies pour une prochaine authentification
//   // Mise en cookie du token d'accès
//   req.cookies.set('access_token', accessToken, {
//     httpOnly: false,
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
//   });

//   // Mise en cookie l'id de l'utilisateur
//   req.cookies.set('my_user_id', user.id, {
//     httpOnly: false,
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
//   });

//   // Redirigez l'utilisateur vers la page /
//   return res.redirect('/');
// }