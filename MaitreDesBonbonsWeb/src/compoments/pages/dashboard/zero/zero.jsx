import PropTypes from 'prop-types';
import ZeroUn from '../../assets/perso/zero/zeroppun.webp'
import './zero.css'

function Zero({dataPool, sendMessage, poolId, dataParty }) {


  return (
    <div className='Zero'>
      <div className="navigator"></div>
      <div className="software"></div>
      <div className="software"></div>
      <div className="software"></div>
      <div className="background">
        <img src={ZeroUn} alt="" />
      </div>
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