import PropTypes from 'prop-types';
import '../header/header.css'

// function Zero({ dataPool, sendMessage, dataParty }) {
function Header({ sendMessage, dataParty }) {

 

  return (
    <div className="navigatorHeader">
      <div className="recharge">
        {/* imd permettant de recharger la page */}
      </div>
      <div className="url">
        <div className="security">
          {/* img clicable permettant de gérer les cookies de la page */}


        </div>
        <div className="link">
          {/* input modifiable permettant de renseigner l'url */}

        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  dataPool: PropTypes.any,
  sendMessage: PropTypes.func.isRequired,
  dataParty: PropTypes.object.isRequired,
};

export default Header;