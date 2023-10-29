import PropTypes from 'prop-types';
import ZeroUn from '../../../assets/perso/zero/zeroppun.webp'
import './zero.css'

// importations des différents element
import Headers from './Header/ElementHeader'
import { useEffect, useState } from 'react';

function Zero({dataPool, sendMessage, poolId, dataParty }) {
  const [selectSoftware, setSelectSoftware] = useState({
    ZeroContainerElementSoftwareUn: '',
    ZeroContainerElementSoftwareDeux: '',
    ZeroContainerElementSoftwareTrois: '',
    ZeroContainerElementSoftwareQuatre: '',
  })

  useEffect(() => {




  }, [selectSoftware])

  return (
    <div className='Zero'>
      <div className="container">
        <div className="Element">
          <Headers
            dataParty={dataParty}
            onSetSelectSoftware={setSelectSoftware}
            selectSoftware={selectSoftware}
            ZeroContainerElementSoftwareIndex='ZeroContainerElementSoftwareUn'
          />

        </div>
        <div className="Element">
          <Headers
            dataParty={dataParty}
            onSetSelectSoftware={setSelectSoftware}
            selectSoftware={selectSoftware}
            ZeroContainerElementSoftwareIndex='ZeroContainerElementSoftwareDeux'
          />

        </div>
        <div className="Element">
          <Headers
            dataParty={dataParty}
            onSetSelectSoftware={setSelectSoftware}
            selectSoftware={selectSoftware}
            ZeroContainerElementSoftwareIndex='ZeroContainerElementSoftwareTrois'
          />

        </div>
        <div className="Element">
          <Headers
            dataParty={dataParty}
            onSetSelectSoftware={setSelectSoftware}
            selectSoftware={selectSoftware}
            ZeroContainerElementSoftwareIndex='ZeroContainerElementSoftwareQuatre'
          />

        </div>
      </div>
      <div className="background">
        <div className="screen">
          <div className="screen-overlay"></div>
        </div>
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