import * as http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

export function start(port: number) {
  // init express
  const app: express.Application = express();

  // init socket.io
  const serverSocket: http.Server = http.createServer(app);
  const io = new Server(serverSocket)

  // config
  app.use(cors());

  /*--------------------------------------------------------------------
   *                              Socket.io
   *--------------------------------------------------------------------
  **/
  io.on('connection', async (socket) => {
    console.log('Un utilisateur s\'est connecté.');
  })

  /*--------------------------------------------------------------------
   *                               Express
   *--------------------------------------------------------------------
  **/
  // authentification with discord
  app.get(/^\/auth\/discord/g, (req, res) => {
    res.send("Hello From Express and Typescirpt")
  })

  // Web distribution
  app.get(/^(?!\/(auth\/discord|socket\.io)).*/, (req, res) => {
    console.log('test');
    express.static('../../MaitreDesBonbonsWeb/dist')
  })

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })

}