import './helpPowershell.css';

function helpPowershell() {
  
  return (
     <div className="ZeroHelpPowershell">
      <div className="container">
        <h1>PowerShell</h1>
        <span></span>
        <p>PowerShell, développé par Microsoft, est un langage de script et une interface en ligne de commande (CLI) conçus pour simplifier la gestion et l&apos;automatisation des tâches sous Windows.</p>
        <p>Pour utiliser une commande, tel que &quot;help&quot;, vous saisissez simplement le nom de la commande suivi éventuellement de paramètres. Par exemple, pour obtenir de l&apos;aide sur une commande spécifique, vous pouvez saisir &quot;help -C NomDeLaCommande&quot;.</p>
        <p>Pour afficher la date et l&apos;heure, vous pouvez utiliser la commande &quot;date&quot;. En tapant simplement cette commande, PowerShell renverra la date actuelle du système.</p>
        <p>PowerShell repose sur une architecture orientée objet, avec des commandlets agissant comme des blocs de construction. Les résultats peuvent être transmis à d&apos;autres commandes via des pipelines, offrant une flexibilité remarquable.</p>
        <p>En résumé, PowerShell simplifie la gestion système sous Windows en offrant un langage de script puissant et une interface en ligne de commande intuitive. L&apos;utilisation de commandes comme &quot;help&quot; et &quot;date&quot; illustre la simplicité et la puissance de cet outil.</p>
      </div>
     </div> 
  );
}

export default helpPowershell;
