import { useState } from 'react';
import PropTypes from 'prop-types';
import ZeroUn from '../../../assets/perso/zero/zeroppun.webp'
import './zero.css'

// importations des différents element
import Headers from './Header/ElementHeader'
import ExplicationPersonnage from '../../personnage/zero/ExplicationPersonnage/explicationPersonnage'
import Powershell from '../../personnage/zero/powershell/powershell'


function Zero({ dataPool, sendMessage, dataParty }) {
  const [selectSoftware, setSelectSoftware] = useState({
    ZeroContainerElementSoftware1: 'explicationPersonnage',
    ZeroContainerElementSoftware2: 'explicationPersonnage',
    ZeroContainerElementSoftware3: 'explicationPersonnage',
    ZeroContainerElementSoftware4: 'explicationPersonnage',
  })

  return (
    <div className='Zero'>
      <div className="container">
        {[1, 2, 3, 4].map((index) => (
          <div className="Element" key={index}>
            <Headers
              dataParty={dataParty}
              onSetSelectSoftware={setSelectSoftware}
              selectSoftware={selectSoftware}
              ZeroContainerElementSoftwareIndex={`ZeroContainerElementSoftware${index}`}
            />
            {selectSoftware[`ZeroContainerElementSoftware${index}`] === 'explicationPersonnage' && <ExplicationPersonnage />}
            {selectSoftware[`ZeroContainerElementSoftware${index}`] === 'powershell' && <Powershell sendMessage={sendMessage} dataParty={dataParty}/>}
          </div>
        ))}
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
  dataParty: PropTypes.object.isRequired,
};

export default Zero;