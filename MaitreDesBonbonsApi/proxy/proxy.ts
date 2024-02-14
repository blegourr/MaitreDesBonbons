import * as http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { EventEmitter } from 'events';
import { getCookieValue } from './Function/cookieGestion';
import { verifyTokenMiddleware, verifyToken } from './Function/AuthentificationDiscord'; //authDiscordAcount

export function start(port: number) {
  /*--------------------------------------------------------------------
   *                                INIT
   *--------------------------------------------------------------------
  **/
  // init express
  const app: express.Application = express();

  // init socket.io
  const serverSocket: http.Server = http.createServer(app);
  const io = new Server(serverSocket)

  // init EventEmitter
  const eventEmitter = new EventEmitter();

  /*--------------------------------------------------------------------
   *                              Config
   *--------------------------------------------------------------------
  **/
  app.use(cors());
  app.use(cookieParser());

  /*--------------------------------------------------------------------
   *                              Socket.io
   *--------------------------------------------------------------------
  **/
  io.on('connection', async (socket) => {
    console.log('Un utilisateur s\'est connecté.');

    // récupère les cookie
    const cookies = socket.handshake.headers.cookie || '';

    // récupère l'access_token et vérifie le, récupère l'id 
    const access_token = getCookieValue(cookies, 'access_token')
    if (!access_token || typeof access_token !== 'string') {
      socket.emit('error', 'Cookie invalide')
    }

    // vérifie si le token est valide
    const user = await verifyToken(access_token || '')

    if (!user) {
      
      return console.error('error -> user Undefund')
    }
    // crée un event permettant de recontacter l'utilisateur
    const socketEmitUser = `sendMessage_${user.id}`;
    eventEmitter.on(socketEmitUser, ({ event, message }: { event: string, message: any }) => {
      if (!event || !message) {
        return console.error('error -> event or message are undefined', event, message);
      }
      socket.emit(event, message);
    });

    // faits rejoindre l'utilisateur une pool
    // joinPool({
    //   userId: user.id,
    //   eventEmitter: eventEmitter,
    //   socketEmitUser: socketEmitUser
    // })


    /**----------------------------------------------------
     *             Création des liseners
     *-----------------------------------------------------
     */
     socket.on('disconnect', () => {
      console.log('Un utilisateur s\'est déconnecté.');
    });

  })

  /*--------------------------------------------------------------------
   *                               Express
   *--------------------------------------------------------------------
  **/
  app.get('/errorLogin', (req, res) => {
    res.status(401).send('Erreur de connexion.\n\nMoi j\'aime me faire ratio (;');
  });


  // authentification with discord
  app.get(/^\/auth\/discord/g, (req, res) => {
    res.send("Hello From Express and Typescirpt");
  })

  // Web distribution
  app.get(/^(?!\/(auth\/discord|socket\.io)).*/, async (req, res, next) => {

    if (await verifyTokenMiddleware(req, res, next)) {
      if (!req.url.startsWith('/assets/')) {
        // envoie le fichier html
        res.type('html');
        res.sendFile(path.join(__dirname, '../page/build/index.html'));
      } else {
        // Le code de votre route ici    
        express.static(path.join(__dirname, '../page/build/'))(req, res, next);
      }
    }
  });

  /*--------------------------------------------------------------------
   *                                Start
   *--------------------------------------------------------------------
  **/
   const serveur = http.createServer(app);
   io.attach(serveur);
   serveur.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
   // relie le ws au serveur https

}