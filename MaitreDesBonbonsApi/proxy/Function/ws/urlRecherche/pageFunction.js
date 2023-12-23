/**----------------------------------------------------
 *           Création des fonctions
 *-----------------------------------------------------
 */
// récupération des paramètres dans une url
function getParams(url) {
  const paramsObject = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    const paramsArray = queryString.split('&');

    paramsArray.forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        paramsObject[key] = decodeURIComponent(value);
      }
    });
  }

  return paramsObject;
}


/**----------------------------------------------------
 *        Création des fonctions exporter
 *-----------------------------------------------------
 */

const home = ({ pageDetails, partyAdmin, party, urlInfo, urlObject }) => {
  // vérifie la présences du cookie sinon faire une demande de redirection vers login
  
}

const login = ({ pageDetails, partyAdmin, party, urlInfo, urlObject }) => {
  // renvoie la page de login, si l'utilisateur est déjà connecter il faire une demande de redirection vers home ( $domaim$/ ) 



}

const wpContent = ({ pageDetails, partyAdmin, party, urlInfo, urlObject }) => {
  // renvoie les différents fichiers présents sur le serveur




}

const wpContentReadme = ({ pageDetails, partyAdmin, party, urlInfo, urlObject }) => {
  // renvoie le fichiers readme





}

const uploadsImg = ({ pageDetails, partyAdmin, party, urlInfo, urlObject }) => {
  // vérifie la présences du token dans l'url si valide renvoie de l'image



}



module.exports = {
  home,
  login,
  wpContent,
  wpContentReadme,
  uploadsImg
};