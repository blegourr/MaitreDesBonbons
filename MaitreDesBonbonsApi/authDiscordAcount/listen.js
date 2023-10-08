const Koa = require('koa');
const session = require('koa-session');
const passport = require('koa-passport');
const DiscordStrategy = require('passport-discord').Strategy;
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// Chargez les variables d'environnement depuis un fichier .env
require('dotenv').config();

// Configuration de la session
app.keys = ['your-secret-key']; // Changez ceci en une clé secrète appropriée
app.use(session({}, app));

// Configuration de Passport.js
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile, done)
  
}));

// Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Définition des routes avec koa-router
router.get('/auth/discord', passport.authenticate('discord'));
router.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: '/confirmation',
  failureRedirect: '/error',
}));
router.get('/confirmation', (ctx) => {
  ctx.body = 'Vous êtes connecté au compte Discord.';
});
router.get('/error', (ctx) => {
  ctx.body = 'Erreur de connexion.';
});

// Utilisation du routeur Koa
app.use(router.routes());
app.use(router.allowedMethods());

// Démarrez le serveur sur le port process.env.PORT || 80;
app.listen(process.env.PORT || 80, () => {
  console.log('Serveur démarré sur le port 80');
});
