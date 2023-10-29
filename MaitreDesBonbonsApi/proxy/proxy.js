const Koa = require('koa');
const Router = require('koa-router');
const { Server } = require("socket.io");
const http = require('http');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const AuthentificationDiscord = require('./Function/AuthentificationDiscord')
const cookieFunction = require('./Function/cookieGestion')
const joinPool = require('./Function/ws/joinPool')
/**----------------------------------------------------
 *              création config
 *-----------------------------------------------------
 */
const app = new Koa();
const router = new Router();

// Chargez les variables d'environnement depuis un fichier .env
require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_CALLBACK_URL;

/**----------------------------------------------------
 *                     CODE
 *-----------------------------------------------------
 */

const start = () => {
  /**----------------------------------------------------
   *                        WS
   *-----------------------------------------------------
   */
  // Configuration de Socket.io
  const server = http.createServer(app.callback());
  const io = new Server(server);

  io.on('connection', async (socket) => {
    console.log('Un utilisateur s\'est connecté.');

    // récupère les cookie
    const cookies = socket.handshake.headers.cookie;
    
    // récupère l'access_token et vérifie le, récupère l'id 
    const access_token = cookieFunction.getCookieValue(cookies, 'access_token')
    if (!access_token) {
      socket.emit('error', 'Cookie invalide')
    }

    // vérifie si le token est valide
    const user = await AuthentificationDiscord.verifyToken(access_token)
    // faits rejoindre l'utilisateur une pool
    joinPool({
      userId: user.id,
    })

    socket.on('ModifDBParty', (data) => {
      // Commence la partie 
    });

    socket.on('StartGame', (data) => {
      // Commence la partie 
    });

    socket.on('disconnect', () => {
      console.log('Un utilisateur s\'est déconnecté.');
    });
  });

  /**----------------------------------------------------
   *                Définition des routes
   *-----------------------------------------------------
   */

  // route si il y a une redirection sur la page d'erreur de connection
  router.get('/errorLogin', (ctx) => {
    ctx.body = 'Erreur de connexion. \n\nMoi j\'aime me faire ratio (;';
    ctx.status = 401
  });


  // route permettant de distribuer la page web
  router.get(/^(?!\/auth\/discord).*/, AuthentificationDiscord.verifyTokenMiddleware, async (ctx, next) => {
    // si l'url ne commence pas par /assets/ renvoyer l'html
    if (!ctx.url.startsWith('/assets/')) {
      // envoie le fichier html
      ctx.type = 'html';
      ctx.body = fs.createReadStream(path.join(__dirname, '../page/build/index.html'));
      return next()
    }

    // Le code de votre route ici
    await serve(path.join(__dirname, '../page/build'))(ctx, next);
  });


  router.get(/^\/auth\/discord/g, async (ctx) => {
    await AuthentificationDiscord.authDiscordAcount(ctx)
  });

  /**----------------------------------------------------
  *              Configuration Serveur
  *------------------------------------------------------
  */
  // Utilisation du routeur Koa
  app.use(router.routes());
  app.use(router.allowedMethods());

  // Démarrez le serveur sur le port process.env.PORT || 80;
  const PORT = process.env.PORT || 80;
  server.listen(PORT, () => {
    console.log(`Serveur Koa démarré sur le port ${PORT}`);
  });
}




module.exports = {
  start,
}