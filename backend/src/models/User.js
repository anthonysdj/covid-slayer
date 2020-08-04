const { currentTime } = require('../helpers/datetime');
const mongoose = require('mongoose');
const Joi = require('joi');
// const { getPlayer } = require('../repositories/repository');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    date_created: { type: Date, default: currentTime }
});

// UserSchema.methods.generateAuthToken = async function() {
//     const player = await getPlayer(this._id);
//     // console.log(player);
//     return jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
// }

const User = mongoose.model('User', UserSchema);

const validate = (request) => {
    const schema = Joi.object({
        fullName: Joi.string().min(4).max(255).required(),
        playerName: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(7).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    });

    // const 
    return schema.validate(request, { abortEarly: false });
}

module.exports.User = User;
module.exports.validate = validate;