const Koa = require('koa');
const session = require('koa-session');
const passport = require('koa-passport');
const DiscordStrategy = require('passport-discord').Strategy;
const Router = require('koa-router');
const WebSocket = require('ws');

const app = new Koa();
const router = new Router();

// Chargez les variables d'environnement depuis un fichier .env
require('dotenv').config();

const ensureAuthenticated = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    // L'utilisateur est authentifié, continuez vers la page /pool
    return next();
  } else {
    // L'utilisateur n'est pas authentifié, redirigez-le vers la page d'erreur de connexion
    ctx.redirect('/errorLogin');
  }
};


module.exports = async client => {
  client.listenAuthDiscord = () => {

    // Créez un serveur WebSocket
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws, request) => {
      // Gérez les connexions WebSocket ici
      console.log('Nouvelle connexion WebSocket');
    });

    // Configuration de la session
    app.keys = ['your-secret-key']; // Changez ceci en une clé secrète appropriée
    app.use(session({}, app));

    // Configuration de Passport.js
    passport.serializeUser((user, done) => {
      done(null, user.id); // Stockez l'ID de l'utilisateur dans la session
    });

    passport.deserializeUser((id, done) => {
      // Récupérez l'utilisateur à partir de l'ID stocké dans la session
      // et appelez done(null, user) pour le transmettre à la route
      done(null, id);
    });

    passport.use(new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken, profile, done)

      // ajoute l'utilisateur à la db
      let db = await client.getParty()
      const existingUserIndex = db.users.findIndex(user => user.id === profile.id);
      if (existingUserIndex !== -1) {
        // Mettez à jour l'utilisateur existant en utilisant l'ID correspondant
        db.users[existingUserIndex] = {
          id: profile.id,
          accessToken: profile.accessToken
        };

        await client.updateParty(db)
        console.log('L\'utilisateur existe déjà. Mise à jour effectuée.');

        // Redirection vers la page /pool
        done(null, profile);
      } else {
        // Ajoutez un nouvel utilisateur s'il n'existe pas dans la liste
        db.users.push({
          id: profile.id,
          accessToken: profile.accessToken
        });

        await client.updateParty(db)
        console.log('Nouvel utilisateur ajouté à la base de données.');

        // Redirection vers la page /pool
        done(null, profile);
      }
    }));

    // Initialisation de Passport.js
    app.use(passport.initialize());
    app.use(passport.session());

    // Définition des routes avec koa-router
    router.get('/auth/discord', async (ctx, next) => {
      await passport.authenticate('discord', {
        failureRedirect: 'https://blegourr.fr/errorLogin',
        successRedirect: 'https://blegourr.fr/pool'
      })(ctx, next);
    });

    router.get('/pool', ensureAuthenticated, (ctx) => {
      ctx.body = 'Vous êtes connecté au compte Discord. Connexion en cours au WebSocket.';

      // renvoie la page web 



      






    });

    router.get('/errorLogin', (ctx) => {
      ctx.body = 'Erreur de connexion.';
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

  }
}