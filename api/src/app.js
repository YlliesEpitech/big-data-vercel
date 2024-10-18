require('dotenv').config();
const cors = require('cors');
const connection = require("./models/connection")
const express = require('express');
const CryptoCurrency = require("./models/crypto");
const Currency = require("./models/currency")
const { fetchData } = require('./utils/functions/AllExports');

const app = express();

app.use(cors());

const saveCryptoCurrencies = async () => {
  try {
    const data = await fetchData();

    // Itérer sur chaque objet dans le tableau `data`
    for (const crypto of data) {
      // Vérifie si la cryptomonnaie existe déjà dans la db
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
    }
    console.log("Cryptos ajoutées", data);
  } catch (error) {
    console.error("Erreur lors de la création des cryptos", error);
  }
};
// Exécuter saveCryptoCurrencies toutes les 5 minutes
setInterval(saveCryptoCurrencies, 5 * 60 * 1000);


app.get("/cryptocurrencies", async (req, res) => {
  try {
    const cryptos = await CryptoCurrency.find().populate('currencies');
    res.json(cryptos);
  } catch (error) {
    console.error("Erreur lors de la récupération des cryptomonnaies", error);
    res.status(500).json({ error: "Erreur lors de la récupération des cryptomonnaies" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const data = await fetchData();

    // Itérer sur chaque objet dans le tableau data
    for (const crypto of data) {
      // Vérifie si la crypto existe déjà dans la db
      let existingCrypto = await CryptoCurrency.findOne({ name: crypto.name, symbol: crypto.symbol });

      // Créer une nouvelle devise
      const newCurrency = new Currency({
        currency: crypto.price,
        date: new Date(),
      });

      await newCurrency.save(); // Attendre que la devise soit sauvegardée

      if (existingCrypto) {
        // Si elle existe, ajouter la nouvelle devise à l'array currencies de la cryptom existante
        existingCrypto.currencies.push(newCurrency._id);
        await existingCrypto.save(); // Enregistrer les changements
      } else {
        // Si elle n'existe pas, créer une nouvelle cryptomonnaie
        const newCrypto = new CryptoCurrency({
          name: crypto.name,
          symbol: crypto.symbol,
          currencies: [newCurrency._id],
        });
        await newCrypto.save(); // Sauvegarder la nouvelle crypto
      }
    }
    res.json({ message: "Cryptos ajoutées", data: data });

  } catch (error) {
    console.error("Erreur lors de la création des cryptos", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.listen(3000, () => {
  console.log("Server has started 🚀");
});