import './mitm.css';

function mitm() {

  return (
    <div className="ZeroMitm">
      <div className="container">
      <h1>Commande MITM - Documentation</h1>
        <span></span>
        <p>Bienvenue dans la documentation de la Commande MITM.</p>
        
        <h2>Utilisation de la Commande</h2>
        <p>La syntaxe de la commande est la suivante :</p>
        <code>mitm -i [adresse_ip]</code>
        <p>Remplacez [adresse_ip] par l&apos;adresse IP de la cible que vous souhaitez attaquer en utilisant une attaque de l&apos;homme du milieu (MITM).</p>
      </div>
     </div> 
  );
}

export default mitm;
