const express = require('express');
const router = express.Router();
const authApi = require('../middlewares/auth-api');
const { newGame, getCovidMonster, getPlayer, getGame, updateGame, createLogs, getGameLogs } = require('../repositories/repository');
const { playerAction } = require('../helpers/game');
const gameTimeCheck = require('../middlewares/game-time-check');

/**
 * 
 * Begin new game
 */
router.post('/', authApi, async (req, res) => {
    const enemy = await getCovidMonster();
    const player = await getPlayer(req.user._id);

    const game = await newGame(Date.now(), req.body.timeLimit, player, enemy);

    /**
     * return
     * player name
     */
    res.send({ gameId: game._id, playerName: player.name });
});


/**
 * 
 */
router.get('/:id', [authApi, gameTimeCheck], async (req, res) => {
    let game = await getGame(req.params.id);

    const player = game.player;
    const enemy = game.opponent;
    const action = req.query.action;

    let power = 1;
    let enemyPower = 1;
    let logMessages = [];
    let end = 0;
    let status = game.status;

    switch(action) {
        case 'attack':
            power = playerAction(player.maxAttack);
            enemyPower = playerAction(enemy.skills[1].power);

            // player attacks
            logMessages.push(`${player.name} attacks ${enemy.name} for ${power} damage`);
            logMessages.push(`${enemy.name} looses ${power} hp`);

            // enemy counters
            logMessages.push(`${enemy.name} counters and infects ${player.name} for ${enemyPower} damage`);
            logMessages.push(`${player.name} looses ${enemyPower} hp`);

            // update game table, check for enemy hp
            game = await updateGame(game._id, {
                opponentHealth: game.opponentHealth + -Math.abs(power),
                playerHealth: game.playerHealth + -Math.abs(enemyPower)
            });

            if (game.opponentHealth < 1 || game.playerHealth < 1) {
                end = 1;
            }

            break;
        case 'skill_healing_potion':
            power = playerAction(player.skills[1].power);
            enemyPower = playerAction(enemy.skills[1].power);

            logMessages.push(`${player.name} uses a healing potion and gains ${power} hp`);
            logMessages.push(`${enemy.name} spreads infection causing ${enemyPower} damage to ${player.name}`);

            // update game table, check for enemy hp
            game = await updateGame(game._id, {
                playerHealth: game.playerHealth + power - enemyPower
            });

            if (game.playerHealth < 1) {
                end = 1;
            }

            break;
        case 'skill_power_attack':
            power = player.skills[0].power;

            logMessages.push(`${player.name} power attacks ${enemy.name} for ${power} damage`);
            logMessages.push(`${player.name} prone to power infection looses ${power} hp`);
            logMessages.push(`Both ${player.name} and ${enemy.name} lost ${power} hp`);

            // update game table
            game = await updateGame(game._id, {
                playerHealth: game.playerHealth + -Math.abs(power),
                opponentHealth: game.opponentHealth + -Math.abs(power)
            });

            if (game.opponentHealth < 1 || game.playerHealth < 1) {
                end = 1;
            }

            break;
        case 'surrender':
            logMessages.push(`${player.name} surrenders and dies.`);
            status = 'surrender';
            end = 1;

            break;
        default:
            return res.status(400).send('Unknown command.');
    }

    if (end) {
        // game ends

        if (status !== 'surrender') { 
            if ((game.playerHealth < 1 && game.opponentHealth < 1) || game.playerHealth === game.opponentHealth) {
                logMessages.push(`Fight between ${player.name} and ${enemy.name} resulted in a draw.`);
                status = 'draw';
            } else if (game.playerHealth < 1) {
                logMessages.push(`${enemy.name} defeated ${player.name}`);
                status = 'loose';
            } else {
                logMessages.push(`${player.name} defeated ${enemy.name}`);
                status = 'win';
            }
        }

        await updateGame(game._id, {status: status});
    }

    await createLogs(game._id, logMessages);

    res.send({ end, status, logMessages });
});

router.get('/:id/logs', async (req, res) => {
    const logs = await getGameLogs(req.params.id);
    res.send(logs);
});

module.exports = router;