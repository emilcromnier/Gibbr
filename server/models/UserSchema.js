const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true
    },
    email: {
        type: String, required: true, unique: true
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

module.exports = mongoose.model('User', UserSchema);  //node.js export. Apparently node pluralizes the model name to create the collection name