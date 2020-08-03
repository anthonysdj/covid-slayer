const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/User');
const { generateAuthToken } = require('../helpers/auth-token');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userInput = validate(req.body);

    // validate the user input
    if (userInput.error) return res.status(422).send(userInput.error.details);

    // check if user already existing
    const user = await User.findOne({ email: email });
    if (! user) return res.status(400).send({ message: 'Invalid email or password' });

    // check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (! validPassword) res.send({ message: 'Invalid email or password' });

    // create the signed token
    const token = await generateAuthToken(user._id);

    res.send(token);
});

const validate = (request) => {
    const schema = Joi.object({
        email: Joi.string().min(7).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    });

    // const 
    return schema.validate(request, { abortEarly: false });
}

module.exports = router;