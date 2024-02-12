const dotenv = require('dotenv');
const mongoose = require('mongoose');
const proxy = require('./proxy/proxy');

// Fonction pour se connecter à la base de données
async function connectToDatabase(uri, options) {
    try {
        await mongoose.connect(uri, options);
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
        throw error;
    }
}

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI;

const mongOption = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

// Appel de la fonction pour se connecter à la base de données
connectToDatabase(DATABASE_URI, mongOption)
    .then(() => {
        // Définition de la promesse mongoose.Promise à global.Promise
        mongoose.Promise = global.Promise;

        // Message de confirmation de connexion réussie
        console.log('DB connectée');

        // Vérifie si une partie existe sinon la crée
        proxy.start();
    })
    .catch(error => {
        // Gestion de l'erreur de connexion à la base de données
        console.error(`Connexion à la base de données échouée: ${error}`);
    });

// Gestion des événements de processus
process.on('exit', code => {
    console.log(`Le processus s'est arrêté avec le code d'erreur: ${code}!`);
});

process.on('uncaughtException', (err, origin) => {
    console.log(`Uncaught Exception: ${err}, Origine: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(`Unhandled Rejection: ${reason}\n-----\n`, promise);
});

process.on('warning', (...args) => {
    console.log(...args);
});
