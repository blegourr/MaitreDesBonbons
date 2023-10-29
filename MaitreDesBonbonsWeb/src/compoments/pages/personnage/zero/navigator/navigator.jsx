import PropTypes from 'prop-types';
import './navigator.css'

function Zero({dataPool, sendMessage, poolId, dataParty }) {


  return (
    <div className='Navigator'>
    </div>
  );
}

Zero.propTypes = {
  dataPool: PropTypes.any, // Changez le type en fonction de ce que vous attendez pour dataPool
  sendMessage: PropTypes.func.isRequired,
  poolId: PropTypes.string,
  dataParty: PropTypes.object.isRequired,
};

export default Zero;