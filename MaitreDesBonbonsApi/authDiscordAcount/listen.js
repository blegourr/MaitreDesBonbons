const Koa = require('koa');
const Router = require('koa-router');
const WebSocket = require('ws');
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const webSocketEmitter = new EventEmitter();
const joinPool = require('./ws/joinPool')
const sendMessageToPool = require('./ws/sendMessagePool')

const app = new Koa();
const router = new Router();

// Chargez les variables d'environnement depuis un fichier .env
require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_CALLBACK_URL;

module.exports = async (client) => {
  // définietion des variable d'envireonnement
  let poolGlobal = []

  client.listenAuthDiscord = () => {
    /**
     * function permmettant de récupérer un cookie
     * @param {String} cookieString 
     * @param {String} cookieName 
     * @returns cookie
     */
    function getCookieValue(cookieString, cookieName) {
      const cookies = cookieString.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
          return value;
        }
      }
      return null; // Retourne null si le cookie n'est pas trouvé
    }

    /**
     * création du webSocket
     */

    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', async (ws, request) => {


      // Gérez les connexions WebSocket ici
      const cookieHeader = request.headers['cookie'];
      if (!cookieHeader) {
        wss.close();
        return ws.send(`Cookie invalide`);
      }

      // récupère le cookie et vérifie si il est valide
      const access_token = getCookieValue(cookieHeader, 'access_token')
      if (!access_token) {
        return ws.send(`Cookie invalide`);
      }

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = await userResponse.json();

      if (!user || !user.id) {
        return ws.send(`Cookie invalide`);
      }


      // crée le websockets Event qui convient
      const wsEvent = `sendMessage_${user.id}`
      webSocketEmitter.on(wsEvent, (data) => {
        ws.send(data.message)
      });

      ws.on('message', async (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          if (!parsedMessage.cookies) {
            return ws.send(`Cookie invalide`);
          }

          // récupère le cookie et vérifie si il est valide
          const access_token = getCookieValue(parsedMessage.cookies, 'access_token')

          if (!access_token) {
            return ws.send(`Cookie invalide`);
          }

          const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const user = await userResponse.json();
          if (!user || !user.id) {
            return ws.send(`Cookie invalide`);
          }

          // vérifie si la command est présente ainsi que que le poolID
          if (!parsedMessage.command || !parsedMessage.poolId || isNaN(parsedMessage.poolId)) {
            ws.send('unvalid response')
          }

          /**
           *  éxécute la commande demander
           */

          // rejoindre la pool
          if (parsedMessage.command === 'joinPool') {
            poolGlobal = await joinPool({
              poolGlobal: poolGlobal,
              userId: user.id,
              poolId: parsedMessage.poolId,
              client: client,
              webSocketEmitter: webSocketEmitter,
              ws: wsEvent
            })
          }

          if (parsedMessage.command === 'sendMessageToPool' && parsedMessage.message) {
            // envoie le message
            sendMessageToPool({
              poolGlobal: poolGlobal,
              poolId: parsedMessage.poolId,
              message: parsedMessage.message,
              webSocketEmitter: webSocketEmitter,
              userId: user.id
            })
          }


          if (parsedMessage.command === 'sendModifDB' && parsedMessage.message) {
            // récupère la db

          }


        } catch (error) {
          console.error(error)
          ws.send("internal serveur error")
        }
      });



      ws.send('Bienvenue sur le serveur WebSocket !');

    });

    router.get('/auth/discord', async (ctx) => {
      const code = ctx.query.code;
      if (!code) {
        ctx.redirect('/errorLogin');
        return;
      }

      try {
        // Échangez le code d'authentification contre un jeton d'accès Discord
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

        const data = await response.json();
        const accessToken = data.access_token;

        // Utilisez l'accessToken pour obtenir les informations de l'utilisateur depuis Discord API
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = await userResponse.json();

        // ajoute l'utilisateur à la db
        let db = await client.getParty()
        const existingUserIndex = db.users.findIndex(userFind => userFind.id === user.id);
        if (existingUserIndex !== -1) {
          // Mettez à jour l'utilisateur existant en utilisant l'ID correspondant
          db.users[existingUserIndex] = {
            id: user.id,
            name: user.global_name,
            avatar: user.avatar
          };

          await client.updateParty(db)
          console.log('L\'utilisateur existe déjà. Mise à jour effectuée.');
        } else {
          // Ajoutez un nouvel utilisateur s'il n'existe pas dans la liste
          db.users.push({
            id: user.id,
            name: user.global_name,
            avatar: user.avatar
          });

          await client.updateParty(db)
          console.log('Nouvel utilisateur ajouté à la base de données.');
        }


        // Mise en cookie du token d'accès
        ctx.cookies.set('access_token', accessToken, {
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        // Redirigez l'utilisateur vers la page /pool
        ctx.redirect('/pool');
      } catch (error) {
        console.error('Erreur lors de l\'authentification Discord :', error);
        ctx.redirect('/errorLogin');
      }
    });

    router.get('/errorLogin', (ctx) => {
      ctx.body = 'Erreur de connexion.';
    });

    // Définition des routes avec koa-router
    router.all(('(.*)'), async (ctx, next) => {
      ctx.body = 'Vous êtes connecté au compte Discord. Connexion en cours au WebSocket.';
      // vérifie la validiter du token avant le chargement de la page (access_token se trouve dans les cookie sous se nom access_token)
      const accessToken = ctx.cookies.get('access_token');

      if (!accessToken) {
        ctx.redirect('/errorLogin'); // Redirigez vers la page d'erreur de connexion si le cookie d'accès est manquant
        return;
      }


      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await userResponse.json();

      if (!user || !user.id) {
        ctx.redirect('/errorLogin'); // Redirigez vers la page d'erreur de connexion si le cookie d'accès est manquant
        return;
      }

      // une fois le token vérifier ont renvoie la page web react
      const buildDirectory = path.join(__dirname, '../page/build');
      const filePath = path.join(buildDirectory, ctx.path);
      const indexPath = path.join(buildDirectory, 'index.html');
      try {
        if (ctx.url.match(/^(?!\/assets).*/) && fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
          // Si le fichier existe, renvoyer son contenu
          ctx.body = fs.readFileSync(indexPath, 'utf-8');
          ctx.type = mime.getType('html'); // Définit le Content-Type à 'text/html'
        } else if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          // Si le fichier existe, renvoyer son contenu
          ctx.body = fs.readFileSync(filePath, 'utf-8');
          const contentType = mime.getType(path.extname(filePath).slice(1)); // Obtient le Content-Type à partir de l'extension du fichier
          if (contentType) {
            ctx.type = contentType;
          }
        } else {
          // Sinon, retourner une erreur 404
          ctx.status = 404;
        }
      } catch (err) {
        // En cas d'erreur, retourner une erreur 500
        console.error(err);
        ctx.status = 500;
      }
      await next();

    });

    // Utilisation du routeur Koa
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Démarrez le serveur sur le port process.env.PORT || 80;
    const server = app.listen(process.env.PORT || 80, () => {
      console.log('Serveur démarré sur le port 80');
    });

    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
  };
};