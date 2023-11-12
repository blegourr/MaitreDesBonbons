import PropTypes from 'prop-types';
import '../header/header.css'

// import des svg
import Refresh from '../../../../../assets/navigator/refresh';
import Lock_closed from '../../../../../assets/navigator/clock_closed';

// import de l'input
import Input from './input/input'

// function Header({ setInputUrl, urlInfo, dataParty, sendMessage, setUrlInfo }) {
function Header({ dataParty, sendMessage, setUrlInfo }) {

  return (
    <div className="navigatorHeader">
      <div className="recharge">
        {/* svg permettant de recharger la page */}
        <Refresh />
      </div>
      <div className="url">
        <div className="security">
          {/* mets le sécu ou le non sécu en fonction de se qui est transmis */}


          {/* svg clicable permettant de gérer les cookies de la page */}
          <Lock_closed />

        </div>
        <div className="link">
          {/* input modifiable permettant de renseigner l'url */}
          <Input dataParty={dataParty} sendMessage={sendMessage} setUrlInfo={setUrlInfo}/>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  urlInfo: PropTypes.object.isRequired,
  dataParty: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  setUrlInfo: PropTypes.func.isRequired,
};

export default Header;