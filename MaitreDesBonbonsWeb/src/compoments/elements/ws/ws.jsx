import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const WebSocketProvider = ({onPoolId, onDataPool, onDataParty, children }) => {
  const navigate = useNavigate();
  const wsUrl = 'wss://blegourr.fr'; // L'URL du serveur WebSocket
  const [ws, setWs] = useState(null);
  const [poolId, setPoolID] = useState(null);

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
          onDataPool(result.json)
          return setPoolID(result.json.poolId)
        }

        if (result.type === 'UserJoin') {
          return onDataPool(result.json)
        }

        if (result.type === 'ModifDBParty') {
          try {
            return onDataParty(JSON.parse(result.json))
          } 
          catch {
            return onDataParty(result.json)
          }
        }

        if (result.type === 'StartGame') {
          // mets à jour la db
          try {
            onDataParty(JSON.parse(result.json))
          } 
          catch {
            onDataParty(result.json)
          }

          // redirige les participant vers le dashboard
          navigate('/Dashboard')
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
  }, [onDataPool, onDataParty, navigate]);

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
  onPoolId: PropTypes.func.isRequired,
  onDataPool: PropTypes.func.isRequired,
  onDataParty: PropTypes.func.isRequired
};

export default WebSocketProvider;