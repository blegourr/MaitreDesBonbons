const FunctionDBModificationUser = require('../../db/Fucntion/User')

/**----------------------------------------------------
 *                     CONFIG
 *-----------------------------------------------------
 */
require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_CALLBACK_URL;

/**----------------------------------------------------
 *      création de la fonction récupérer un cookie
 *-----------------------------------------------------
 */
 function getCookieValue(allCookie, cookieName) {
  const cookies = allCookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null; // Retourne null si le cookie n'est pas trouvé
}

/**----------------------------------------------------
 *                      EXPORTS
 *-----------------------------------------------------
 */

module.exports = {
  getCookieValue,
}