const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
    type: String,
    required: function () {
      return !this.email; // username is required if email is false
    },
    unique: true,
  },
  email: {
    type: String,
    required: function () {
      return !this.username; // email is required if username is false
    },
    unique: true,
    lowercase: true,
    trim: true,
  },
    password: {  //hash later (bcryptjs or custom?)
        type: String, required: true
    },
    stats:{
        gamesReviewed : { type: Number, default: 0 },
        //averageScore : { type: Number, default: 0 },  //if we want individual score distribution
        gamesCompleted : { type: Number, default: 0 }
    }
}, {timestamps: true});

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "userId"
});

module.exports = mongoose.model('User', UserSchema);  //node.js export. Apparently node pluralizes the model name to create the collection name