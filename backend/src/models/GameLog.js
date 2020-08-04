const mongoose = require('mongoose');
const { currentDateTimeInt } = require('../helpers/datetime');

const GameLog = mongoose.model('GameLog', new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    message: { type: String, required: true },
    dateCreated: { type: Number, default: currentDateTimeInt }
}));

module.exports = GameLog;