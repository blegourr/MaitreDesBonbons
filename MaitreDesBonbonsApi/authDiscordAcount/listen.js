const Koa = require('koa');
const Router = require('koa-router');
const WebSocket = require('ws');
const mime = require('mime');
const fs = require('fs');
const serve = require('koa-static');
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
        ws.send(`Cookie invalide`);
        wss.close()
        ws.close()
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

      // fait rejoindre l'utilisateur dans sont ancienne pool ou fait lui rejoindre la dernière pool ou crée un pool si la dernière est foul


      // Parcourt les piscines (pools) pour vérifier si un objet 'poolGlobal[x1].users[x2].id' existe.
      // Si l'objet existe, fait rejoindre l'utilisateur à cette piscine (pool).
      const poolWithUser = poolGlobal.filter(pool => pool.users.filter(userInPool => userInPool.id === user.id))
      // si l'utilisateur est déjà dans une pool l'ajouter dedans
      if (poolWithUser.length >= 1) {
        poolGlobal = await joinPool({
          poolGlobal: poolGlobal,
          userId: user.id,
          poolId: poolWithUser[0].poolId,
          client: client,
          webSocketEmitter: webSocketEmitter,
          ws: wsEvent
        })
      } else {
        // vérifie si la dernière pool est complète
        const IsFullPool = poolGlobal.length >= 1 ? poolGlobal[poolGlobal.length - 1].users.length >= 3 : true
        if (IsFullPool) {
          // la dernière pool is full ou il n'y a pas de poolExistante donc on en crée une nouvelle
          poolGlobal = await joinPool({
            poolGlobal: poolGlobal,
            userId: user.id,
            poolId: poolGlobal.length + 1,
            client: client,
            webSocketEmitter: webSocketEmitter,
            ws: wsEvent
          })
        } else {
          // il reste de la place dans la dernière pool donc ajouter l'utilisateur dedans
          poolGlobal = await joinPool({
            poolGlobal: poolGlobal,
            userId: user.id,
            poolId: poolGlobal.length - 1,
            client: client,
            webSocketEmitter: webSocketEmitter,
            ws: wsEvent
          })
        }
      }

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


          if (parsedMessage.command === 'sendModifDBParty' && parsedMessage.message) {
            //modifie la db et envoie un message au autre utilisateur pour la syncro
            
          }


        } catch (error) {
          console.error(error)
          ws.send("internal serveur error")
        }
      });
    });

    router.get(/^\/auth\/discord/g, async (ctx, next) => {
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
        if (user.message === 401) {
          ctx.redirect('/errorLogin');
          return;
        }
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

        console.log(user);

        // Mise en cookie du token d'accès
        ctx.cookies.set('access_token', accessToken, {
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        ctx.cookies.set('my_user_id', user.id, {
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        // Redirigez l'utilisateur vers la page /
        ctx.redirect('/');
        return next();
      } catch (error) {
        console.error('Erreur lors de l\'authentification Discord :', error);
        ctx.redirect('/errorLogin');
        return next()
      }
    });

    router.get('/errorLogin', (ctx) => {
      ctx.body = 'Erreur de connexion.';
      ctx.status = 401
    });


    // Middleware de vérification du token Discord
    const verifyTokenMiddleware = async (ctx, next) => {
      // Vérifiez la validité du token Discord ici
      const accessToken = ctx.cookies.get('access_token');
      if (!accessToken) {
        ctx.status = 401;
        ctx.redirect('/errorLogin');
        return;
      }

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await userResponse.json();

      if (!user || !user.id) {
        ctx.status = 401;
        ctx.redirect('/errorLogin');
        return;
      }

      await next();
    };

    // Route combinant les deux middleware app.use
    router.get(/^(?!\/auth\/discord).*/, verifyTokenMiddleware, async (ctx, next) => {
      // Le code de votre route ici
      await serve(path.join(__dirname, '../page/build'))(ctx, next);
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