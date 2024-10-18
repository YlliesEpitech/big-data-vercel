import { fetchData } from './src/utils/functions/AllExports'; // Assurez-vous d'importer fetchData
import CryptoCurrency from './src/models/crypto'; // Assurez-vous que le modèle est correctement importé
import Currency from './src/models/currency'; // Assurez-vous que le modèle est correctement importé

export default async function handler(req, res) {
    const authorizationHeader = req.headers['authorization']; // Récupérer l'en-tête Authorization

    // Vérifier si l'en-tête d'autorisation correspond au secret
    if (authorizationHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized'); // Si le secret ne correspond pas, renvoie une erreur 401
    }

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
        res.status(200).json({ message: "Cryptos ajoutées", data });
    } catch (error) {
        console.error("Erreur lors de la création des cryptos", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
