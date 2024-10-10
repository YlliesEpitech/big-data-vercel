const express = require("express");
const app = express();
const cheerio = require("cheerio");

app.get("/", async (req, res) => {

  const fetchData = async () => {
    // Récupère l'html de la page
    const url = "https://www.coingecko.com/";
    const response = await fetch(url);
    const data = await response.text();

    // Récupère les valeurs que je souhaite de la page.
    return getCrypto(data); // Assurez-vous que fetchData retourne le tableau
  };

  // Fonction pour récupérer les valeurs que je souhaite
  const getCrypto = async (html) => {
    const $ = cheerio.load(html);
    const arr = [];

    // Utilisation d'un compteur pour limiter à 30 éléments
    $('.tw-text-gray-700.dark\\:tw-text-moon-100.tw-font-semibold.tw-text-sm.tw-leading-5').each(function (index) {
      // Limite à 30 cryptomonnaies
      if (index >= 51) return false; // Arrête la boucle après 30 itérations

      try {
        // Extraire le texte complet et enlever le symbole
        let fullText = $(this).text().replace(/\r?\n?/g, '').trim();

        // Supposons que le nom et le symbole sont séparés par un espace
        const parts = fullText.split(' ');
        const coinName = parts.slice(0, parts.length - 1).join(' '); // Prend tout sauf le dernier élément comme nom
        const symbol = parts[parts.length - 1]; // Le dernier élément est le symbole

        // Extraire le prix
        const priceElement = $(this).closest('tr').find('span[data-price-target="price"]').first();
        const price = priceElement.length > 0 ? priceElement.text().trim() : null;

        // Créer un objet et l'ajouter au tableau que si price a une valeur true
        price &&
          arr.push({
            name: coinName.trim(), // Supprime les espaces supplémentaires
            symbol: symbol,
            price: price,
            date: new Date()
          });
      } catch (error) {
        console.error('Erreur lors du traitement des données de la cryptomonnaie:', error);
      }
    });

    return arr;
  };

  const data = await fetchData();
  console.log(data.length)
  res.json({ data: data });
});


app.listen(3000, () => {
  console.log("Server has started");
});
