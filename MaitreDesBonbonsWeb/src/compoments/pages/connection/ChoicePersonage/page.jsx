import PropTypes from 'prop-types';
import './page.css'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//importation des image des personnage
import Zero from '../../../assets/perso/zero/zeroppdeux.webp'
import Fbi from '../../../assets/perso/fbi/fbippun.webp'
import Bonbon from '../../../assets/perso/bonbon/bonbonppun.webp'

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null; // Retourne null si le cookie n'est pas trouvé
}

function getAvatarURl(dataPool, UserID) {
  console.log(dataPool, 'datapool');
  // définie la pp à notre utilisateur
  const dataPoolUser = dataPool?.users[UserID]
  if (!dataPoolUser) {
    return console.error(`dataPoolUser not found`)
  }

  // récupère l'avatar de l'utilisateur
  const avatarURl = `https://cdn.discordapp.com/avatars/${UserID}/${dataPoolUser.avatar}.webp?size=512`
  return avatarURl
}

function ChoicePersonage({ dataPool, sendMessage, dataParty }) {
  const navigate = useNavigate();

  const ZeroSelection = useRef()
  const FBIoSelection = useRef()
  const BonbonSelection = useRef()

  const ZeroSelectionAvatar = useRef()
  const FBISelectionAvatar = useRef()
  const BonbonSelectionAvatar = useRef()

  const containerBtnStartGame = useRef()

  const [blockZero, setblockZero] = useState(false)
  const [blockFBI, setblockFBI] = useState(false)
  const [blockBonbon, setblockBonbon] = useState(false)


  const UserID = getCookie('my_user_id')
  if (!UserID) {
    console.error(`UserID not found`)
  }

    useEffect(() => {
      // block un utilisateur de prendre un perso s'il a déjà été sélectionner
      if (dataParty && UserID && dataPool) {
        if (dataParty.players.agentFbi.playersID) {
          const avatarURl = getAvatarURl(dataPool, dataParty.players.agentFbi.playersID)
          FBISelectionAvatar.current.src = avatarURl
          FBIoSelection.current.classList.add('active');

          if (dataParty.players.agentFbi.playersID !== UserID) setblockFBI(true)
        } else {
          setblockFBI(false)
          if (!dataParty.players.agentFbi.playersID) FBIoSelection.current.classList.remove('active');
        }
  
        if (dataParty.players.maitreBonBon.playersID) {
          const avatarURl = getAvatarURl(dataPool, dataParty.players.maitreBonBon.playersID)
          BonbonSelectionAvatar.current.src = avatarURl
          BonbonSelection.current.classList.add('active');

          if (dataParty.players.maitreBonBon.playersID !== UserID) setblockBonbon(true)
        } else {
          setblockBonbon(false)
          if (!dataParty.players.maitreBonBon.playersID) BonbonSelection.current.classList.remove('active');
        }
  
        if (dataParty.players.zero.playersID) {
          const avatarURl = getAvatarURl(dataPool, dataParty.players.zero.playersID)
          ZeroSelectionAvatar.current.src = avatarURl
          ZeroSelection.current.classList.add('active');

          if (dataParty.players.zero.playersID !== UserID) setblockZero(true)
        } else {
          setblockZero(false)
          if (!dataParty.players.zero.playersID) ZeroSelection.current.classList.remove('active');
        }

        // si les 3 perso on un players assigner faire apparaitre le button pour lancer la game
        if (dataParty.players.agentFbi.playersID && dataParty.players.maitreBonBon.playersID && dataParty.players.zero.playersID) {
          // affiche le button
          containerBtnStartGame.current.classList.add("active")
        } else {
          containerBtnStartGame.current.classList.remove("active")
        }


        if (dataParty.settings.start) {
          navigate('/Dashboard')
        }
      }
    }, [dataParty, UserID, dataPool, navigate])

  const handleButtonClickZero = () => {
    // bloque si déjà utiliser par un autre joueur
    if (blockZero) return

    // récupère mon avatar url
    if (ZeroSelection.current.classList.contains('active')) {
      dataParty.players.zero.playersID = ''
    } else {
      const avatarURl = getAvatarURl(dataPool, UserID)
      ZeroSelectionAvatar.current.src = avatarURl
      dataParty.players.zero.playersID = UserID

      if (dataParty.players.agentFbi.playersID === UserID) {
        dataParty.players.agentFbi.playersID = ''
      }

      if (dataParty.players.maitreBonBon.playersID === UserID) {
        dataParty.players.maitreBonBon.playersID = ''
      }
    }
    ZeroSelection.current.classList.toggle('active');

    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage({
      type: 'ModifDBParty',
      message: {
        poolId: dataParty.partyID,
        json: dataParty
      }
    });
  };

  const handleButtonClickFbi = () => {
    // bloque si déjà utiliser par un autre joueur
    if (blockFBI) return

    // récupère mon avatar url
    if (FBIoSelection.current.classList.contains('active')) {
      dataParty.players.agentFbi.playersID = ''
    } else {
      const avatarURl = getAvatarURl(dataPool, UserID)
      FBISelectionAvatar.current.src = avatarURl
      dataParty.players.agentFbi.playersID = UserID

      if (dataParty.players.zero.playersID === UserID) {
        dataParty.players.zero.playersID = ''
      }

      if (dataParty.players.maitreBonBon.playersID === UserID) {
        dataParty.players.maitreBonBon.playersID = ''
      }
    }
    FBIoSelection.current.classList.toggle('active');

    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage({
      type: 'ModifDBParty',
      message: {
        poolId: dataParty.partyID,
        json: dataParty
      }
    });
  };

  const handleButtonClickBonbon = () => {
    // bloque si déjà utiliser par un autre joueur
    if (blockBonbon) return

    /// récupère mon avatar url
    if (BonbonSelection.current.classList.contains('active')) {
      dataParty.players.maitreBonBon.playersID = ''
    } else {
      const avatarURl = getAvatarURl(dataPool, UserID)
      BonbonSelectionAvatar.current.src = avatarURl
      dataParty.players.maitreBonBon.playersID = UserID

      if (dataParty.players.agentFbi.playersID === UserID) {
        dataParty.players.agentFbi.playersID = ''
      }

      if (dataParty.players.zero.playersID === UserID) {
        dataParty.players.zero.playersID = ''
      }
    }
    BonbonSelection.current.classList.toggle('active');

    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
    sendMessage({
      type: 'ModifDBParty',
      message: {
        poolId: dataParty.partyID,
        json: dataParty
      }
    });
  };

  const handleButtonClickStartGame = () => {
    // envoyer le début de la partie au players
    // vérifie si les 3 utilisateurs sont bien présents
    sendMessage({
      type: 'StartGame',
      message:  dataParty.partyID   
    })
  }


  return (
    <div className='ChoicePersonage'>
      <div className="containerPerso">
      <div className={`perso ${blockZero ? 'block' : ''}`} onClick={handleButtonClickZero}>
          <div className="pp">
            <div className="screen">
              <div className="screen-overlay"></div>
            </div>
            <img src={Zero} alt="" />
          </div>
          <div className="selection" ref={ZeroSelection}>
            <img src="" alt="" ref={ZeroSelectionAvatar} />
            <p>Zero selectionné </p>
          </div>
          <div className="popup">
            <p>Vous êtes un hacker professionnel paré à collaborer avec le FBI !</p>
          </div>
          <div className="name">
            <h1>Zero</h1>
          </div>
        </div>
        <div className={`perso ${blockFBI ? 'block' : ''}`} onClick={handleButtonClickFbi}>
          <div className="pp">
            <img src={Fbi} alt="" />
          </div>
          <div className="selection" ref={FBIoSelection}>
            <img src="" alt="" ref={FBISelectionAvatar} />
            <p>Agent du FBI selectionné </p>
          </div>
          <div className="popup">
            <p>Vous êtes notre meilleur agent du FBI !</p>
          </div>
          <div className="name">
            <h1>Agent du FBI</h1>
          </div>
        </div>
        <div className={`perso ${blockBonbon ? 'block' : ''}`} onClick={handleButtonClickBonbon}>
          <div className="pp">
            <img src={Bonbon} alt="" />
          </div>
          <div className="selection" ref={BonbonSelection}>
            <img src="" alt="" ref={BonbonSelectionAvatar} />
            <p>Maître des bonbons selectionné </p>
          </div>
          <div className="popup">
            <p>Vous êtes le maître des bonbons prêt à tout pour atteindre la réussite !</p>
          </div>
          <div className="name">
            <h1>Maitre des Bonbons</h1>
          </div>
        </div>
      </div>
      <div className="containerButtonStartGame" ref={containerBtnStartGame}>
        <button className="buttonStartGame" onClick={handleButtonClickStartGame}>Commencer la partie</button>
      </div>
    </div>
  );
}

ChoicePersonage.propTypes = {
  dataPool: PropTypes.any, // Changez le type en fonction de ce que vous attendez pour dataPool
  sendMessage: PropTypes.func.isRequired,
  dataParty: PropTypes.object.isRequired,
};

export default ChoicePersonage;