/**----------------------------------------------------
 *      création de la fonction récupérer un cookie
 *-----------------------------------------------------
 */
 export function getCookieValue(allCookie: string, cookieName: string) {
  const cookies = allCookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null; // Retourne null si le cookie n'est pas trouvé
}