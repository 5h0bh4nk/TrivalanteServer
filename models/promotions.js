const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mogoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name:{
        Type: String,
        required: true
    },
    image: {
        Type: String,
        required: true
    },
    label: {
        Type: String,
        default: ''
    },
    price: {
        Type: Currency,
        required: true,
        min: 0
    },
    description: {
        Type: String,
        required: true
    },
    featured: {
        Type: Boolean,
        default: false
    }
});

var Promos = mongoose.model('Promo',promoSchema);

module.exports=Promos;