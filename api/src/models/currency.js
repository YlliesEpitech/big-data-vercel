const mongoose = require('mongoose');

const currencySchema = mongoose.Schema({
    currency: String,
    date: Date,

});

const Currency = mongoose.model('currencies', currencySchema);

module.exports = Currency;