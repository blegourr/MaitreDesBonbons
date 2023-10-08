import PropTypes from 'prop-types';

function ChoicePersonage({ dataPool, onDataPool, sendMessage }) {
  console.log(dataPool, onDataPool,)
  const handleButtonClick = () => {
    // Vérifiez si la connexion WebSocket est ouverte avant d'envoyer un message
      sendMessage({ command: 'joinPool', poolId: '123', message: '12345678910' ,cookies: document.cookie});
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Envoyer un message WebSocket</button>
      {/* Reste de votre composant */}
    </div>
  );
}

ChoicePersonage.propTypes = {
  dataPool: PropTypes.any, // Changez le type en fonction de ce que vous attendez pour dataPool
  onDataPool: PropTypes.func.isRequired, // Exemple avec un type de fonction requise
  sendMessage: PropTypes.func.isRequired
};

export default ChoicePersonage;
