const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
    amount: { 
        type: Number, 
        required: [true, 'Amount is required'], 
        min: [0.01, 'Amount cannot be less than 0.01'] 
    },
    status: { 
        type: String, 
        enum: ['pending', 'rejected', 'accepted'], 
        default: 'pending' 
    }
});

module.exports = mongoose.model('Offer', offerSchema);