import { useState } from 'react';
import PropTypes from 'prop-types';
import './navigator.css'

// import header
import Header from './header/header'

// import page


function Zero({ sendMessage, dataParty }) {
  const [urlInfo, setUrlInfo] = useState({
    security: true,
    valide: false,
    present: false,
    page: '404',
    url: '',
  })



  return (
    <div className='Navigator'>
      {/* header */}
      <Header urlInfo={urlInfo} setUrlInfo={setUrlInfo} sendMessage={sendMessage} dataParty={dataParty}/>

      {/* page */}

    </div>
  );
}

Zero.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  poolId: PropTypes.string,
  dataParty: PropTypes.object.isRequired,
};

export default Zero;