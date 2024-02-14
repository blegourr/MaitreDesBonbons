import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement du fichier .env

export default defineConfig({
  plugins: [react()],
  define: {
    // 'process.env': process.env // Utiliser les variables d'environnement définies dans le fichier .env
    'process.env': import.meta.env,
  }
});
