import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const WebSocketProvider = ({ children }) => {
  const wsUrl = 'wss://blegourr.fr'; // L'URL du serveur WebSocket
  const [ws, setWs] = useState(null);

  const sendMessage = useCallback((message) => {
    // Vérifiez si la connexion WebSocket est établie avant d'envoyer un message
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.error("La connexion WebSocket n'est pas établie.");
    }
  }, [ws]);

  useEffect(() => {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('Connexion WebSocket établie');
        setWs(socket); // Stockez la connexion WebSocket dans l'état local
      };

      socket.onmessage = (event) => {
        // Manipulez les données reçues du serveur WebSocket ici
        console.log('Données reçues du serveur:', event.data);
      };

      socket.onclose = () => {
        console.log('Connexion WebSocket fermée');
        // Vous pouvez gérer la reconnexion ici si nécessaire
      };

      // Nettoyez la connexion lors du démontage du composant
      return () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
  }, []); // Ajoutez 'sendMessage' et 'isConnected' au tableau des dépendances

  // Envoyez un message pour rejoindre la pool dès que la connexion est établie
  useEffect(() => {
    if (ws) {
      const joinPoolCommand = JSON.stringify({ command: 'joinPool', poolId: '123', cookies: document.cookie});
      sendMessage(joinPoolCommand);
    }
  }, [ws, sendMessage]);

  return (
    <>
      {children(sendMessage)} {/* Appel de children en tant que fonction avec la fonction sendMessage en tant qu'argument */}
    </>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.func.isRequired, // children est désormais une fonction qui reçoit sendMessage
};

export default WebSocketProvider;