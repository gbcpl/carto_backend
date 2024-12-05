const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Création de l'application Express
const app = express();

// Utilisation de CORS pour autoriser les requêtes depuis tous les domaines
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Définir une route API simple
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Node.js !');
});

// Exemple d'API RESTful
app.get('/data', (req, res) => {
  res.json({ message: 'Ceci est une réponse JSON de l\'API.' });
});

// Exemple d'API RESTful avec un paramètre
app.get('/data/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Vous avez demandé l'élément avec l'ID: ${id}` });
});

app.get('/wikipedia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Encoder l'ID pour éviter les problèmes de caractères spéciaux
    const encodedId = encodeURIComponent(id);
    
    // Utiliser l'ID encodé pour appeler l'API Wikipedia
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodedId}&uselang=en`);
    
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];  // Récupérer l'ID de la page (devrait être un seul élément)
    const extract = pages[pageId]?.extract;  // Récupérer l'extrait

    if (extract) {
      res.json({ extract });
    } else {
      res.status(404).json({ error: 'Extrait non trouvé pour cette page' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les données' });
  }
});

// Définir le port d'écoute
const port = 3000;
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});
