'use strict';

const connect = require('./connection');
const express = require('express');
const home = require('./src/routes/home');
const users = require('./src/routes/users');
const game = require('./src/routes/game');
const auth = require('./src/routes/auth');
const { getCovidMonster, createPlayer } = require('./src/repositories/repository');

if (! process.env.JWT_PRIVATE_KEY) {
    console.error('Unable to start application, missing JWT private key');
    process.exit(1);
}

connect()
    .then(() => console.log('Connected to mongodb...'))
    .catch(err => console.log('Error connecting to mongodb', err));

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 8080;
const HOST = '0.0.0.0';

app.use('/src/uploads', express.static('./src/uploads'));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/games', game);
app.use('/', home);

app.listen(PORT, HOST, async function() {
    console.log(`Running on http://${HOST}:${PORT}`);

    const existing = await getCovidMonster();
    if (existing) {
        return console.log('Already initialised.');
    }

     // covid monster skills
     const defaultSkills = [
        {name: 'covid_sneeze', power: 200, type: 'attack'},
        {name: 'covid_infect', power: 10, type: 'passiveAttack'},
    ];

    // create the covid monster
    await createPlayer({
        user: 'aaaaaaaaaaaaaaaaaaaaaaa1',
        name: 'Covid Monster',
        maxHealth: 100,
        maxAttack: 1,
        skills: defaultSkills
    });

    console.log('Inititalised.');
});