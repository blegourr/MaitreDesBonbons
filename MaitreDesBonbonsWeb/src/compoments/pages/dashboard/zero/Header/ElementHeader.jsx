import PropTypes from 'prop-types';
import './ElementHeader.css'
import SelectMenu from './element/SelectMenu/SelectMenu'

function Zero({dataParty, selectSoftware, onSetSelectSoftware, ZeroContainerElementSoftwareIndex }) {
  // récupère la liste des softwares
  let software = dataParty.software.zero
  // rajoute les software qui sont utilisable tous le long de la partie
  software.navigator = true
  software.powershell = true
  software.helpPowershell = true
  software.explicationPersonnage = true

  return (
    <div className='ZeroElementNavigator'>
      <div className="HeaderContainer">
        <p>Vous avez sélectionné: {selectSoftware[ZeroContainerElementSoftwareIndex]}</p>
      </div>
      <div className="HeaderContainer">
        <SelectMenu
          software={software}
          onSetSelectSoftware={onSetSelectSoftware}
          ZeroContainerElementSoftwareIndex={ZeroContainerElementSoftwareIndex}
        />
      </div>
    </div>
  );
}

Zero.propTypes = {
  dataParty: PropTypes.object.isRequired,
  onSetSelectSoftware: PropTypes.func.isRequired,
  selectSoftware: PropTypes.object.isRequired,
  ZeroContainerElementSoftwareIndex: PropTypes.string.isRequired
};

export default Zero;