import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const WebSocketProvider = ({onPoolId, children }) => {
  const wsUrl = 'wss://blegourr.fr'; // L'URL du serveur WebSocket
  const [ws, setWs] = useState(null);
  const [poolId, setPoolID] = useState(null);
  // const [receivedInitialResponse, setReceivedInitialResponse] = useState(false);

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
        const result = JSON.parse(event.data)

        // Manipulez les données reçues du serveur WebSocket ici
        console.log('Données reçues du serveur:', result);

        // exécuter l'action approprié selon la commande demander
        if (result.type === 'join') {
          // modifie la variable d'environemment pour que l'utilisateur puisse répondre dans la bonne pool
          setPoolID(result.json.poolId)


        }

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

  useEffect(() => {
    onPoolId(poolId)
  }, [poolId, onPoolId])

  return (
    <>
      {children(sendMessage)} {/* Appel de children en tant que fonction avec la fonction sendMessage en tant qu'argument */}
    </>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.func.isRequired, // children est désormais une fonction qui reçoit sendMessage
  onPoolId: PropTypes.func.isRequired
};

export default WebSocketProvider;