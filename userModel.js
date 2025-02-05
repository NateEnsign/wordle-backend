const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    stats: {
        gamesWon: {type: Number},
        gamesLost: {type: Number}
    },
    winDistribution: {
        oneTry: {type: Number},
        twoTry: {type: Number},
        threeTry: {type: Number},
        fourTry: {type: Number},
        fiveTry: {type: Number},
        sixTry: {type: Number}
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);