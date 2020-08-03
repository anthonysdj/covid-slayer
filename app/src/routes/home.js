const express = require('express');
const router = express.Router();
const { currentTime } = require('../helpers/datetime');

router.get('/', (req, res) => {
    // console.log('hello');

    // getUser(1, function(user) {
    //     console.log(user);
    // });

    // function getUser(id, cb) {
    //     console.log('reading user from database');

    //     setTimeout(() => {
    //         return cb({id: id, name: 'Ton Dj'});
    //     }, 2000);
    // }

    res.send({boom: Date.now()});
});

module.exports = router;