const mongoose = require('mongoose');

const Player = mongoose.model('Player', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    maxHealth: {
        type: Number,
        required: true,
        default: 100
    },
    maxAttack: {
        type: Number,
        required: true,
        default: 10
    },
    skills: [
        {
            name: String,
            power: Number,
            skill_type: {
                type: String,
                enum: ['attack', 'heal', 'passiveAttack'],
                lowercase: true
            }
        }
    ]
}));

// const validatePlayer = (request) => {
//     const schema = Joi.object({
//         user: Joi.required(),
//         name: Joi.string().min(2).max(255).required()
//     });

//     // const 
//     return schema.validate(request, { abortEarly: false });
// }

module.exports.Player = Player;