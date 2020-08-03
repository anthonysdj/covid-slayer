const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect('mongodb://mongo/covid_slayer?authSource=admin',  {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS
    });
}

module.exports = connectDb;