const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artwork = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    condition: {type: String, 
                required: [true, 'Condition is required'],
                enum:['new', 'like_new', 'used', 'fair', 'poor']},
    price: {type: Number, 
            required: [true, 'Price is required'],
            min: [0.01, 'Price cannot be less than 0.01']},
    details: { type: String,
                required: [true, 'Details is required'],
                minLength: [20, 'The content should have at least 10 characters']},
    image: {type: String, required: [true, 'Picture is required']},
    totalOffers: {type: Number, default: 0},
    highestOffer: { type: Number, default: 0 },
    active: {type: Boolean, default: true},
});

module.exports = mongoose.model('Artwork', artwork);