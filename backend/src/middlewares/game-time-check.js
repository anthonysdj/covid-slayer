const { getGame, updateGame, createLogs } = require("../repositories/repository");

async function gameTimeCheck(req, res, next) {
    const game = await getGame(req.params.id);
    const player = game.player;
    const enemy = game.opponent;

    if (! game) return res.status(400).send('missing game id');

    const {timeStart, timeLimit, status} = game;

    let timelapse = timeStart + timeLimit * 1000;

    if (status !== 'undecided') return res.status(400).send('This game is already completed.');

    if (Date.now() > timelapse) {
        let logMessages = [];
        let statusMessage = 'You ';
        let newStatus = status;

        if ((game.playerHealth < 1 && game.opponentHealth < 1) || game.playerHealth === game.opponentHealth) {
            logMessages.push(`Fight between ${player.name} and ${enemy.name} resulted in a draw.`);
            newStatus = 'draw';
            statusMessage = 'It\'s a ' + newStatus;
        } else if (game.playerHealth < 1 || game.playerHealth < game.opponentHealth) {
            logMessages.push(`${enemy.name} defeated ${player.name}`);
            newStatus = 'loose';
            statusMessage += newStatus;
        } else {
            logMessages.push(`${player.name} defeated ${enemy.name}`);
            newStatus = 'win';
            statusMessage += newStatus;
        }

        await updateGame(game._id, {status: newStatus});
        await createLogs(game._id, logMessages);

        return res.status(200).send({ end: 1, message: `Time has expired! ${statusMessage}` });
    }

    next();
}

module.exports = gameTimeCheck;