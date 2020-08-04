const { User } = require("../models/User");
const { Player } = require("../models/Player");
const { Game } = require("../models/Game");
const GameLog = require("../models/GameLog");

const createUser = (request) => {
    const { fullName, email, password, avatar } = request;

    const newUser = (new User({
        fullName: fullName,
        email: email,
        password: password,
        avatar: avatar
    })).save();

    return newUser;
}

const createPlayer = (request) => {
    const { user, name, maxHealth, maxAttack, skills } = request;

    const newPlayer = (new Player({
        user: user,
        name: name,
        maxHealth: maxHealth,
        maxAttack: maxAttack,
        skills: skills
    })).save();

    return newPlayer;
}

const getPlayer = (userId) => {
    return Player.findOne({ user: userId }).select({ name: 1, maxAttack: 1, maxHealth: 1, skills: 1 });
}

function getCovidMonster () {
    return getPlayer('aaaaaaaaaaaaaaaaaaaaaaa1');
}

function getGame (id) {
    return Game.findById(id)
    .populate(['opponent', 'player'])
    .select({
        player: 1,
        playerHealth: 1,
        opponent: 1,
        opponentHealth: 1,
        timeStart: 1,
        timeLimit: 1,
        status: 1
    });
}

const newGame = (timeStart, timeLimit, player, enemy) => {
    return (new Game({
        player: player._id,
        playerHealth: player.maxHealth,
        opponent: enemy._id,
        opponentHealth: enemy.maxHealth,
        timeLimit: timeLimit,
        timeStart: timeStart,
        status: 'undecided'
    })).save();
}

async function updateGame(gameId, data) {
    const game = await Game.findById(gameId);
    if (! game) return;

    if (data.playerHealth) game.playerHealth = data.playerHealth;
    if (data.opponentHealth) game.opponentHealth = data.opponentHealth;
    if (data.status) game.status = data.status;

    game.save();

    return game;
}

async function createLogs(gameId, logs) {
    if (! logs || logs.length < 1) return;

    const loggers = await Promise.all(logs.map(async log => {
        const newLog = new GameLog({
            game: gameId,
            message: log,
            dateCreated: Date.now()
        });

        await newLog.save();

        return newLog;
    }));

    return loggers;
}

function getGameLogs(gameId) {
    return GameLog.find({ game: gameId }).limit(10).sort({ dateCreated: 'desc' });
}

module.exports.createUser = createUser;
module.exports.createPlayer = createPlayer;
module.exports.newGame = newGame;
module.exports.getCovidMonster = getCovidMonster;
module.exports.getPlayer = getPlayer;
module.exports.getGame = getGame;
module.exports.updateGame = updateGame;
module.exports.createLogs = createLogs;
module.exports.getGameLogs = getGameLogs;