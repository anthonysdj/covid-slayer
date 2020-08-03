const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/User');
const handleFileUpload = require('../middlewares/uploader');
const { createUser, createPlayer } = require('../repositories/repository');
const hasher = require('../helpers/hasher');
const { generateAuthToken } = require('../helpers/auth-token');

/**
 * Get all users
 */
router.get('/', async (req, res) => {
    const user = await User.find().select({fullName: 1, email: 1, avatar: 1, date_created: 1});
    res.send(user);
});

/**
 * Create new user
 */
router.post('/', handleFileUpload, async (req, res) => {
    const { fullName, email, password, playerName } = req.body;
    const userInput = validate(req.body);

    // validate the user input
    if (userInput.error) return res.status(422).send(userInput.error.details);

    // check if user already existing
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).send('This email is already used.');

    // save new user
    const newUser = await createUser({
        fullName: fullName,
        email: email,
        password: await hasher(password),
        avatar: req.file ? req.file.path : null
    });

    // player default skills
    const defaultSkills = [
        {name: 'power_attack', power: 20, type: 'attack'},
        {name: 'healing_potion', power: 20, type: 'heal'},
    ];

    // save new player
    const newPlayer = await createPlayer({
        user: newUser._id,
        name: playerName,
        skills: defaultSkills
    });

    // create the signed token
    const token = await generateAuthToken(newUser._id);

    res.header('X-Auth-Token', token).send(newPlayer);
});

// router.get('/:id', (req, res) => {
//     // get a user by id
// });

// router.delete('/:id', (req, res) => {
//     // delete a user by id
// });

module.exports = router;
