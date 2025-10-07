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
  
    stats: {
        gamesReviewed : { type: Number, default: 0 },
        //averageScore : { type: Number, default: 0 },  //if we want individual score distribution
        gamesCompleted : { type: Number, default: 0 }
    },

    favorites: {
    type: [String],      // store game slugs or IDs
    validate: [val => val.length <= 4, '{PATH} exceeds the limit of 4']
  },

  currentlyPlaying: [
  {
    gameSlug: { type: String, required: true },
    startedAt: { type: Date, default: Date.now }
  }
],

   backlog: [
    {
      gameSlug: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]

}, {timestamps: true});

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "userId"
});

 // Removes game from from currentlyPlaying upon completion
UserSchema.methods.markGameCompleted = async function (gameSlug) {
 
  this.currentlyPlaying = this.currentlyPlaying.filter(slug => slug !== gameSlug);

  // Increment stats
  this.stats.gamesReviewed += 1;
  this.stats.gamesCompleted += 1;

  await this.save();
};


module.exports = mongoose.model('User', UserSchema);  //node.js export. Apparently node pluralizes the model name to create the collection name

/*await User.findByIdAndUpdate(
  userId,
  { $addToSet: { favorites: "battlefield-1" } }  // $addToSet prevents duplicates
);

await User.findByIdAndUpdate(
  userId,
  { $pull: { favorites: "battlefield-1" } }
);

*/

