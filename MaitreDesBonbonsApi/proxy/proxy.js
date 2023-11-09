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
const modificationDbParty = require('./Function/ws/modificationDbParty')
const EventEmitter = require('events');
const startGame = require('./Function/ws/startGame');
const ChoicePersonage = require('./Function/ws/ChoicePersonage');
const commandePowershell = require('./Function/ws/commandePowershell');
/**----------------------------------------------------
 *              création config
*-----------------------------------------------------
*/
const app = new Koa();
const router = new Router();

const eventEmitter = new EventEmitter();

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

    if (!user) {
      return console.error('error -> user Undefund')
    }
    // crée un event permettant de recontacter l'utilisateur
    const socketEmitUser = `sendMessage_${user.id}`
    eventEmitter.on(socketEmitUser, ({ event, message }) => {
      if (!event || !message) {
        return console.error('error -> event or message are undefined', event, message)
      }
      socket.emit(event, message)
    });

    // faits rejoindre l'utilisateur une pool
    joinPool({
      userId: user.id,
      eventEmitter: eventEmitter,
      socketEmitUser: socketEmitUser
    })


    /**----------------------------------------------------
     *             Création des liseners
     *-----------------------------------------------------
     */
    socket.on('ModifDBParty', (data) => {
      // modifie la db et renvoie les modification à tous les utilisateurs
      modificationDbParty({
        userId: user.id,
        dataBaseModified: data,
        eventEmitter: eventEmitter,
      })
    });

    // modifie la db et renvoie les modification à tous les utilisateurs
    socket.on('ChoicePersonage', (data) => {
      ChoicePersonage({
        userId: user.id,
        partyID: data.partyID,
        personageSelec: data.personageSelec,
        eventEmitter: eventEmitter,
      })
    });

    // Commence la partie
    socket.on('StartGame', (data) => {
      startGame({
        userId: user.id,
        partyID: data,
        eventEmitter: eventEmitter,
      })
    });


    // renvoie la réponse des commande exécuter par notre personnage
    socket.on('commandPowershell', (data) => {
      commandePowershell({
        userId: user.id,
        command: data.command,
        partyID: data.partyID,
        eventEmitter: eventEmitter,
      })
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