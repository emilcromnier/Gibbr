const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gameSlug: { type: String, required: true }, // store RAWG slug
    reviewText: { type: String },
    liked: { type: Boolean, default: false },
    rating: { type: Number, required: true, min : 0, max:10}, //0-5 scale with halves
    completed : {type: Boolean, default: false},
    completedAt: { type: Date }
    
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

ReviewSchema.pre('validate', function(next) {
  if (!this.reviewText && !this.rating && !this.liked) {
    next(new Error("A review must have at least a like, rating, or text."));
  } else {
    next();
  }
});

module.exports = mongoose.model('Review', ReviewSchema);