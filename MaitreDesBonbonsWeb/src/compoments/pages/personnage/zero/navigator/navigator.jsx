import PropTypes from 'prop-types';
import './navigator.css'

// import header
import Header from './header/header'

// import page


function Zero({ sendMessage, poolId, dataParty }) {


  return (
    <div className='Navigator'>
      {/* header */}
      <Header sendMessage={sendMessage} poolId={poolId} dataParty={dataParty} />

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