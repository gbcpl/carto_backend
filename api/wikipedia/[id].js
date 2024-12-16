import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;  // Récupérer le paramètre id de l'URL (ex: "Aquitaine")

  // Définir les en-têtes CORS pour autoriser l'accès à l'API depuis d'autres domaines
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les pré-requêtes CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Faire une requête à l'API Wikipedia pour récupérer l'extrait de la page
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&prop=extracts&exintro&explaintext&titles=${id}`);

    // Log pour voir la réponse brute de l'API Wikipedia
    console.log("Réponse de Wikipedia:", response.data);

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0]; // Récupérer l'ID de la page
    const extract = pages[pageId]?.extract; // Récupérer l'extrait de la page

    if (extract) {
      res.status(200).json({ extract });
    } else {
      res.status(404).json({ error: 'Page non trouvée' });
    }
  } catch (error) {
    // Log de l'erreur
    console.error('Erreur lors de la récupération des données:', error);

    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
}
