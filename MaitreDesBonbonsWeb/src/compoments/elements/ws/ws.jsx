import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

const WebSocketProvider = ({onDataPool, onDataParty, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Établir une connexion WebSocket avec le serveur socket.io
    // const newSocket = io('http://localhost');
    const newSocket = io('https://masterofcandy.blegourr.fr');

    newSocket.on('connect', () => {
      console.log('Connecté au serveur socket.io');
    });

    newSocket.on('UserJoin', (data) => {
      console.log('Message du serveur :', data);
      return onDataPool(data)
    });

    newSocket.on('ModifDBParty', (data) => {
      console.log('Message du serveur :', data);
      // Faites quelque chose avec les données reçues
      onDataParty(data)
    });

    newSocket.on('commandPowershell', (data) => {
      console.log('Message du serveur :', data, 'commandPowershell');
      // Faites quelque chose avec les données reçues
      const event = new CustomEvent(`commandResponse_${data.commandId}`, {
        detail: {
          commandId: data.commandId,
          responseData: data.commandReturn,
        },
      });
      
      // Déclenchez l'événement personnalisé sur l'objet window
      window.dispatchEvent(event);
    });

    newSocket.on('urlRecherche', (data) => {
      console.log('Message du serveur :', data, 'urlRecherche');
      // Faites quelque chose avec les données reçues
      const event = new CustomEvent(`urlRecherche_${data.urlId}`, data);
      
      // Déclenchez l'événement personnalisé sur l'objet window
      window.dispatchEvent(event);
    });

    setSocket(newSocket);

    // Nettoyer la connexion lors du démontage du composant
    return () => {
      newSocket.disconnect();
    };
  }, [onDataParty, onDataPool]);

  const sendMessage = useCallback(({type, message}) => {
    // Envoyer un message au serveur socket.io
    socket.emit(type, message);
  }, [socket]);

  return (
    <>
      {children(sendMessage)} {/* Appel de children en tant que fonction avec la fonction sendMessage en tant qu'argument */}
    </>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.func.isRequired, // children est désormais une fonction qui reçoit sendMessage
  onDataPool: PropTypes.func.isRequired,
  onDataParty: PropTypes.func.isRequired
};

export default WebSocketProvider;
