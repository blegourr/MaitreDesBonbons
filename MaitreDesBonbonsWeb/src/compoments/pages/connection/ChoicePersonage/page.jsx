import PropTypes from 'prop-types';
import './page.css'
import { useRef } from 'react';

//importation des image des personnage
import Zero from '../../../assets/perso/zero/zeroppdeux.webp'
import Fbi from '../../../assets/perso/fbi/fbippun.webp'
import Bonbon from '../../../assets/perso/bonbon/bonbonppun.webp'


function ChoicePersonage({ dataPool, onDataPool, sendMessage, poolId }) {
  const ZeroSelection = useRef()
  const FBIoSelection = useRef()
  const BonbonSelection = useRef()

  console.log(dataPool, onDataPool)
  const handleButtonClickZero = () => {
    // bloque si déjà utiliser par un autre joueur


    ZeroSelection.current.classList.toggle('active');
    FBIoSelection.current.classList.remove('active');
    BonbonSelection.current.classList.remove('active');
    
    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage(JSON.stringify({ command: 'ChangeDB', poolId: poolId, message: '12345678910', cookies: document.cookie }));
  };

  const handleButtonClickFbi = () => {
    // bloque si déjà utiliser par un autre joueur

    ZeroSelection.current.classList.remove('active');
    FBIoSelection.current.classList.toggle('active');
    BonbonSelection.current.classList.remove('active');

    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage(JSON.stringify({ command: 'ChangeDB', poolId: poolId, message: '12345678910', cookies: document.cookie }));
  };

  const handleButtonClickBonbon = () => {
    // bloque si déjà utiliser par un autre joueur


    ZeroSelection.current.classList.remove('active');
    FBIoSelection.current.classList.remove('active');
    BonbonSelection.current.classList.toggle('active');
    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage(JSON.stringify({ command: 'ChangeDB', poolId: poolId, message: '12345678910', cookies: document.cookie }));
  };

  return (
    <div className='ChoicePersonage'>
      <div className="containerPerso">
        <div className="perso" onClick={handleButtonClickZero}>
          <div className="pp">
            <div className="screen">
              <div className="screen-overlay"></div>
            </div>
            <img src={Zero} alt="" />
          </div>
          <div className="selection" ref={ZeroSelection}>
            <img src="https://cdn.discordapp.com/avatars/675428178373771315/a9c05622daddff4036c6d222929e5844.webp?size=512" alt="" />
            <p>vous avez selectionné Zero</p>
          </div>
          <div className="popup">
            <p>Vous êtes un hacker professionnel paré à collaborer avec le FBI !</p>
          </div>
          <div className="name">
            <h1>Zero</h1>
          </div>
        </div>
        <div className="perso" onClick={handleButtonClickFbi}>
          <div className="pp">
            <img src={Fbi} alt="" />
          </div>
          <div className="selection" ref={FBIoSelection}>
            <img src="https://cdn.discordapp.com/avatars/675428178373771315/a9c05622daddff4036c6d222929e5844.webp?size=512" alt="" />
            <p>vous avez selectionné Agent du FBI</p>
          </div>
          <div className="popup">
            <p>Vous êtes notre meilleur agent du FBI !</p>
          </div>
          <div className="name">
            <h1>Agent du FBI</h1>
          </div>
        </div>
        <div className="perso" onClick={handleButtonClickBonbon}>
          <div className="pp">
            <img src={Bonbon} alt="" />
          </div>
          <div className="selection" ref={BonbonSelection}>
            <img src="https://cdn.discordapp.com/avatars/675428178373771315/a9c05622daddff4036c6d222929e5844.webp?size=512" alt="" />
            <p>vous avez selectionné Maître des bonbons</p>
          </div>
          <div className="popup">
            <p>Vous êtes le maître des bonbons prêt à tout pour atteindre la réussite !</p>
          </div>
          <div className="name">
            <h1>Maitre des Bonbons</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

ChoicePersonage.propTypes = {
  dataPool: PropTypes.any, // Changez le type en fonction de ce que vous attendez pour dataPool
  onDataPool: PropTypes.func.isRequired, // Exemple avec un type de fonction requise
  sendMessage: PropTypes.func.isRequired,
  poolId: PropTypes.string,
};

export default ChoicePersonage;