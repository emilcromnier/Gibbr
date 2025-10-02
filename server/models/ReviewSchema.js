const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gameSlug: { type: String, required: true }, // store RAWG slug
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min : 0, max:10}, //0-5 scale with halves
    completed : {type: Boolean, default: false}
    
}, { timestamps: true });

// Transform mongo "_id" to reviewId when converting to JSON
ReviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.reviewId = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Review', ReviewSchema);