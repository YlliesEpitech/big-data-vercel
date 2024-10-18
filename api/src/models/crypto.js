const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Clé unique
    symbol: { type: String, required: true },
    currencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'currencies' }],
});


const CryptoCurrency = mongoose.model('cryptos', cryptoSchema);

module.exports = CryptoCurrency;