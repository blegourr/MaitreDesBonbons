import { useEffect, useRef, useState } from 'react';
import './powershell.css';
import PropTypes from 'prop-types';

function Powershell({ sendMessage, dataParty }) {
  const [commandesExecuted, setCommandesExecuted] = useState([]);
  const [inputCommand, setInputCommand] = useState('');
  const inputRef = useRef(null);
  const containerCommandRef = useRef(null)


  // Fonction pour gérer l'entrée de l'utilisateur et exécuter la commande
  const handleInput = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const userCommand = inputCommand;
      // Vérifiez si la commande est "cls" ou "clear" et exécutez-la côté client
      if (userCommand.toLowerCase() === 'cls' || userCommand.toLowerCase() === 'clear') {
        // Effacez la liste des commandes exécutées
        setCommandesExecuted([]);
      } else {
        const commandId = Date.now()

        // Créez un gestionnaire d'événements pour la réponse de la commande
        const handleResponse = (event) => {
          if (event.detail.commandId === commandId) {
            // Ajoutez la commande à la liste des commandes exécutées
            setCommandesExecuted([...commandesExecuted, { command: userCommand, response: event.detail.responseData }]);
            // Supprimez le gestionnaire d'événements une fois qu'il a été utilisé
            window.removeEventListener(`commandResponse_${commandId}`, handleResponse);
          }
        };

        // Ajoutez le gestionnaire d'événements pour cette commande
        window.addEventListener(`commandResponse_${commandId}`, handleResponse);

        // Envoyez la commande au serveur (utilisez la fonction sendMessage)
        console.log(dataParty);
        sendMessage({
          type: 'commandPowershell',
          message: {
            command: {
              command: userCommand,
              commandName: userCommand.split(' ')[0],
              commandId: commandId,
            },
            partyID: dataParty.partyID
          }
        });
      }
      setInputCommand(''); // Effacez l'input
    }
  };

  // Fonction pour sélectionner l'input lors du clic sur le conteneur
  const handleContainerClick = () => {
    inputRef.current.focus();
  };


  // Fonction pour ajuster la hauteur de l'input en fonction du contenu
  const adjustInputHeight = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.style.height = 'auto';
      inputElement.style.height = inputElement.scrollHeight + 'px';
    }
  };

  // Appeler adjustInputHeight à chaque changement de valeur de l'input
  const handleInputChange = (e) => {
    setInputCommand(e.target.value);
    adjustInputHeight();
  };

  function createParagraphsFromText(text) {
    const paragraphs = text.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
    return paragraphs;
  }

  useEffect(() => {
    // Vérifiez d'abord si containerCommandRef.current existe pour éviter les erreurs
    if (containerCommandRef.current) {
      // Réglez scrollTop sur la hauteur totale du contenu pour faire défiler en bas
      containerCommandRef.current.scrollTop = containerCommandRef.current.scrollHeight;
    }
  }, [commandesExecuted])

  return (
    <div className="ZeroPowershell">
      <div className="containerCommand" onClick={handleContainerClick} ref={containerCommandRef}>
        {/* Boucle des commandes exécutées avec leurs réponses */}
        {commandesExecuted.map((commandObj, index) => (
          <div key={index} className='commandExecuted'>
            <p>C:\Users\Zero&gt; {commandObj.command}</p>
            {createParagraphsFromText(commandObj.response)}
          </div>
        ))}

        {/* Input pour taper les commandes */}
        <div className="containerInput" onClick={() => inputRef.current.focus()}>
          <p>C:\Users\Zero&gt;</p>
          <textarea
            spellCheck="false"
            value={inputCommand}
            onChange={(e) => handleInputChange(e)}
            onKeyPress={handleInput}
            ref={inputRef}
          />
        </div>
      </div>
      <div className="background"></div>
    </div>
  );
}

Powershell.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  dataParty: PropTypes.object.isRequired,
};

export default Powershell;