import './metadata.css';

function metadata() {

  return (
    <div className="ZeroMetadata">
      <div className="container">
        <h1>Commande Metadata - Documentation</h1>
        <span></span>
        <p>Bienvenue dans la documentation de la Commande Metadata.</p>
        
        <h2>Utilisation de la Commande</h2>
        <p>La syntaxe de la commande est la suivante :</p>
        <code>metadata -l [URL]</code>
        <p>Remplacez [URL] par l&apos;adresse du site web dont vous souhaitez récupérer les métadonnées.</p>
        
        <h2>Limitations</h2>
        <p>La commande Metadata fonctionnera uniquement si l&apos;URL spécifiée permet l&apos;accès à l&apos;image requis.</p>
      </div>
     </div> 
  );
}

export default metadata;
