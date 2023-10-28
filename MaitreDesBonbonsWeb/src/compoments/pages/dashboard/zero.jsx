import PropTypes from 'prop-types';


function Zero({dataPool, sendMessage, poolId, dataParty }) {
  

  return (
    <div className='Zero'>
     1234
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