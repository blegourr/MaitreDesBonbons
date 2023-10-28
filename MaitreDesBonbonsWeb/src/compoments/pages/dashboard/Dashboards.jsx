import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Zero from './zero/zero';

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

function Dashboard({ dataPool, sendMessage, poolId, dataParty }) {
  const navigate = useNavigate();

  // récupère la data party et vérifie dans qu'elle personnage utilise notre players
  const UserID = getCookie('my_user_id')
  if (!UserID) {
    console.error(`UserID not found`)
  }

  if (!dataParty) {
    return (
      <div className='Dashboard'></div>
    )
  }

  if (!dataParty.settings.start) {
    navigate('/')
  }

  return (
    <div className='Dashboard'>
      {/* redirige vers la sous page de zero */}
      {dataParty.players.zero.playersID === UserID && (
        <Zero
          dataPool={dataPool}
          sendMessage={sendMessage}
          poolId={poolId}
          dataParty={dataParty}
        />
      )}
      {dataParty.players.agentFbi.playersID === UserID ? 'page agentFbi' : ''}
      {dataParty.players.maitreBonBon.playersID === UserID ? 'page maitreBonBon' : ''}
    </div>
  );
}

Dashboard.propTypes = {
  dataPool: PropTypes.any, // Changez le type en fonction de ce que vous attendez pour dataPool
  sendMessage: PropTypes.func.isRequired,
  poolId: PropTypes.string,
  dataParty: PropTypes.object.isRequired,
};

export default Dashboard;