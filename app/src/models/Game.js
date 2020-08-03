const mongoose = require('mongoose');
// const { currentDateTimeInt } = require('../helpers/datetime');

const Game = mongoose.model('Game', new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    playerHealth: { type: Number, required: true },
    opponentHealth: { type: Number, required: true },
    timeLimit: { type: Number, default: 60 }, // seconds
    timeStart: { type: Number, default: Date.now() },
    status: {
        type: String,
        required: true,
        enum: ['undecided', 'win', 'draw', 'loose', 'surrender'],
        lowercase: true
    }
}));

module.exports.Game = Game;