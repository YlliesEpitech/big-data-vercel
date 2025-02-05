require('dotenv').config();
const cors = require('cors');
const connection = require("./src/models/connection")
const express = require('express');
const CryptoCurrency = require("./src/models/crypto");
const Currency = require("./src/models/currency")
const { fetchData } = require('./src/utils/functions/AllExports');


const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const cryptos = await CryptoCurrency.find().populate('currencies');
    res.json(cryptos);
  } catch (error) {
    console.error("Erreur lors de la récupération des cryptomonnaies", error);
    res.status(500).json({ error: "Erreur lors de la récupération des cryptomonnaies" });
  }
})

app.post("/create", async (req, res) => {
  try {
    const data = await fetchData();

    // Créer un tableau de promesses pour les opérations de sauvegarde
    const cryptoPromises = data.map(async (crypto) => {
      // Vérifie si la crypto existe déjà dans la db
      let existingCrypto = await CryptoCurrency.findOne({ name: crypto.name, symbol: crypto.symbol });

      // Créer une nouvelle devise
      const newCurrency = new Currency({
        currency: crypto.price,
        date: new Date(),
      });

      await newCurrency.save(); // Attendre que la devise soit sauvegardée

      if (existingCrypto) {
        // Si elle existe, ajouter la nouvelle devise à l'array currencies de la cryptomonnaie existante
        existingCrypto.currencies.push(newCurrency._id);
        await existingCrypto.save(); // Enregistrer les changements
      } else {
        // Si elle n'existe pas, créer une nouvelle cryptomonnaie
        const newCrypto = new CryptoCurrency({
          name: crypto.name,
          symbol: crypto.symbol,
          currencies: [newCurrency._id],
        });
        await newCrypto.save(); // Sauvegarder la nouvelle cryptomonnaie
      }
    });

    // Attendre que toutes les promesses soient résolues
    await Promise.all(cryptoPromises);

    res.json({ message: "Cryptos ajoutées", data: data });

  } catch (error) {
    console.error("Erreur lors de la création des cryptos", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/crypto/:name", async (req, res) => {
  const { name } = req.params;

  try {
    // Recherche de la cryptomonnaie par son nom et récupération des devises associées
    const crypto = await CryptoCurrency.findOne({ name })
      .populate({
        path: 'currencies',
        select: 'currency date -_id', // Inclure uniquement la valeur et la date
      });

    if (!crypto) {
      return res.status(404).json({ error: "Cryptomonnaie introuvable" });
    }

    res.json({
      name: crypto.name,
      symbol: crypto.symbol,
      history: crypto.currencies, // Contient l'historique des devises
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la cryptomonnaie", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la cryptomonnaie" });
  }
});


app.listen(3000, () => {
  console.log("Server has started 🚀");
});