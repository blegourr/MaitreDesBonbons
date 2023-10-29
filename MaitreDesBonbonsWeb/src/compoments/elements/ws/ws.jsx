import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';import { io } from 'socket.io-client';

const WebSocketProvider = ({onPoolId, onDataPool, onDataParty, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Établir une connexion WebSocket avec le serveur socket.io
    const newSocket = io('https://blegourr.fr');

    newSocket.on('connect', () => {
      console.log('Connecté au serveur socket.io');
    });

    newSocket.on('message', (data) => {
      console.log('Message du serveur :', data);
      // Faites quelque chose avec les données reçues
    });


    setSocket(newSocket);

    // Nettoyer la connexion lors du démontage du composant
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((type, message) => {
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
  onPoolId: PropTypes.func.isRequired,
  onDataPool: PropTypes.func.isRequired,
  onDataParty: PropTypes.func.isRequired
};

export default WebSocketProvider;
