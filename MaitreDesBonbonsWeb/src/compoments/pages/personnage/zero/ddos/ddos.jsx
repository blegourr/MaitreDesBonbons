import './ddos.css';

function ddos() {

  return (
    <div className="ZeroDdos">
      <div className="container">
        <h1>Commande DDoS - Documentation</h1>
        <span></span>
        <p>Bienvenue dans la documentation de la Commande DDoS.</p>

        <h2>Utilisation de la Commande</h2>
        <p>La syntaxe de la commande est la suivante :</p>
        <code>ddos -i [adresse_ip]</code>
        <p>Remplacez [adresse_ip] par l&apos;adresse IP de la cible que vous souhaitez attaquer.</p>

        <h2>Consignes d&apos;utilisation</h2>
        <p>Cette commande ne doit jamais être utilisée dans un environnement réel. Les attaques DDoS sont illégales et peuvent causer des dommages importants aux systèmes et aux réseaux.</p>
        <p>Il est essentiel de respecter les lois et les règlements en vigueur en matière de cybersécurité. L&apos;utilisation de techniques d&apos;attaque sans autorisation peut entraîner des poursuites judiciaires.</p>
      </div>
    </div>
  );
}

export default ddos;
