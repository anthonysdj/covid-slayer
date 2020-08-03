module.exports.playerAction = function playerAction(atk) {
    return Math.floor(Math.random() * atk + 1);
}