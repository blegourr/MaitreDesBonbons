import PropTypes from 'prop-types';
import './SelectMenu.css'

function Zero({ software, onSetSelectSoftware, ZeroContainerElementSoftwareIndex }) {
  // affiche les software qui sont valide
  let SoftwareAvaible = {}

  for (const key in software) {
    if (software[key] === true) {
      SoftwareAvaible[key] = true
    }
  }

  // Fonction de gestion d'événements pour gérer le clic sur une option
  const handleChange = (event) => {
    onSetSelectSoftware(prevSelect => ({ ...prevSelect, [ZeroContainerElementSoftwareIndex]: event.target.value }));
  };

  return (
      <select 
        name="ZeroElementHeadersSelectMenu" 
        id="ZeroElementHeadersSelectMenu"
        onChange={handleChange}
        defaultValue='explicationPersonnage'
      >
        {Object.keys(SoftwareAvaible).map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
  );
}

Zero.propTypes = {
  software: PropTypes.object.isRequired,
  onSetSelectSoftware: PropTypes.func.isRequired,
  ZeroContainerElementSoftwareIndex: PropTypes.string.isRequired,
};

export default Zero;