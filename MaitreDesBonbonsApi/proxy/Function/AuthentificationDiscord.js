const FunctionDBModificationUser = require('../../db/Fucntion/User')

/**----------------------------------------------------
 *                     CONFIG
 *-----------------------------------------------------
 */
require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_CALLBACK_URL;

/**----------------------------------------------------
 *  création de la fonction de vérification du token
 *-----------------------------------------------------
 */

const verifyTokenMiddleware = async (ctx, next) => {
  // Vérifiez la validité du token Discord ici
  const accessToken = ctx.cookies.get('access_token');
  if (!accessToken) {
    ctx.status = 401;
    return ctx.redirect('/errorLogin');
  }

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = await userResponse.json();
  if (!user || !user.id) {
    ctx.status = 401;
    return ctx.redirect('/errorLogin');
  }

  await next();
};

const verifyToken = async (accessToken) => {
  // Vérifiez la validité du token Discord ici
  if (!accessToken) {
    return console.error(`accessToken undefined`)
  }

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = await userResponse.json();
  if (!user || !user.id) {
    return console.error(`accessToken unvaible`)
  }

  return user
};



/**----------------------------------------------------
 *      création de la fonction d'authentification
 *-----------------------------------------------------
 */
const authDiscordAcount = async (ctx) => {
  // récupère le code d'authentification présents dans l'url de la page
  const code = ctx.query.code;
  if (!code) {console.error(`erreur système authDiscordAcount #&d`, 1);
    return ctx.redirect('/errorLogin');
  }

  // Échangez le code d'authentification contre le token_access Discord.
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      scope: 'identify email',
    }),
  });

  if (!response) {console.error(`erreur système authDiscordAcount #&d`, 2);
    return ctx.redirect('/errorLogin');
  }

  const data = await response.json();
  if (!data) {console.error(`erreur système authDiscordAcount #&d`, 3);
    return ctx.redirect('/errorLogin');
  }

  const accessToken = data.access_token;
  if (!accessToken) {console.error(`erreur système authDiscordAcount #&d`, 4);
    return ctx.redirect('/errorLogin');
  }

  // Utilisez l'accessToken pour obtenir les informations de l'utilisateur depuis l'API Discord
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse) {console.error(`erreur système authDiscordAcount #&d`, 5);
    return ctx.redirect('/errorLogin');
  }

  const user = await userResponse.json();
  if (!user || user.message === 401) {console.error(`erreur système authDiscordAcount #&d`, 6);
    return ctx.redirect('/errorLogin');
  }

  // vérifie si l'utilisateur se trouve dans la db si oui modifie le pour mettre à jour ces donnée sinon crée le
  const UserFound = await FunctionDBModificationUser.getUserByUserID(user.id)
  if (!UserFound) {
    FunctionDBModificationUser.createUser(user.id, {
      name: user.global_name,
      avatar: user.avatar,
    })
  }

  FunctionDBModificationUser.updateUserByUserID(user.id, {
    name: user.global_name,
    avatar: user.avatar,
  })

  // génère les cookies pour une prochaine authentification
  // Mise en cookie du token d'accès
  ctx.cookies.set('access_token', accessToken, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });

  // Mise en cookie l'id de l'utilisateur
  ctx.cookies.set('my_user_id', user.id, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });

  // Redirigez l'utilisateur vers la page /
  ctx.redirect('/');
}



/**----------------------------------------------------
 *                      EXPORTS
 *-----------------------------------------------------
 */

module.exports = {
  verifyTokenMiddleware,
  verifyToken,
  authDiscordAcount,
}