const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gameId: { type: Number, required: true }, //IGDB/RAWG game ID
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min : 0, max:10}, //0-5 scale with halves
    completed : {type: Boolean, default: false}
    
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);