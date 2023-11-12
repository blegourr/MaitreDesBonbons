import PropTypes from 'prop-types';
import './input.css'
import { useState } from 'react';

function Header({ dataParty, sendMessage, setUrlInfo }) {
  const [url, setUrl] = useState('')


  const handelVerifUrl = () => {
    try {
      // Analyser l'URL ici (exemple simplifié)
      console.log(url, 'url');
      const urlObject = new URL(url);
      console.log(urlObject);

      // l'url est valide
      const urlId = Date.now()

      // Créez un gestionnaire d'événements pour la réponse de la commande
      const handleResponse = (event) => {
        if (event.urlId === urlId) {
          // Ajoutez la commande à la liste des commandes exécutées
          setUrlInfo({
            security: event.security,
            valide: event.valide,
            present: event.present,
            page: event.page,
            url: event.url,
          });
          // Supprimez le gestionnaire d'événements une fois qu'il a été utilisé
          window.removeEventListener(`urlRecherche_${urlId}`, handleResponse);
        }
      };

      // Ajoutez le gestionnaire d'événements pour cette commande
      window.addEventListener(`urlRecherche_${urlId}`, handleResponse);

      // Envoyez la commande au serveur (utilisez la fonction sendMessage)
      sendMessage({
        type: 'urlRecherche',
        message: {
          url: {
            url: urlObject,
            urlId: urlId,
          },
          partyID: dataParty.partyID
        }
      });

    } catch (error) {
      console.warn('Erreur lors de l\'analyse de l\'URL ou de la demande au serveur', error);
      setUrlInfo({
        security: true,
        valide: false,
        present: false,
        page: '404',
        url: url
      });
    }
  }



// mets à jour l'url qui est rechercher pour la page si la touche Enter est préssée
const handelInputKeyEnterPressed = (e) => {
  // vérifie si la touche préssée est Entrer 
  if (e.key === 'Enter') {
    e.preventDefault();
    // mets à jour l'url qui est rechercher pour la page 
    handelVerifUrl()
  }
}

// mets à jour la valeur de notre input sans mettre à jour l'url qui permet de faire la recherche 
const handelInput = (e) => {
  setUrl(e.target.value)
}

return (
  <input className="navigatorHeaderInput"
    spellCheck="false"
    value={url}
    onChange={(e) => handelInput(e)}
    onKeyPress={(e) => handelInputKeyEnterPressed(e)}
    placeholder='Rechercher ou entrer une adresse web'
  >
  </input>
);
}

Header.propTypes = {
  dataParty: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  setUrlInfo: PropTypes.func.isRequired,
};

export default Header;