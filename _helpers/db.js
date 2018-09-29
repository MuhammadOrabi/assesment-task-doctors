const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'Connection Error!'));

db.once('open', () => {
    console.log('Connected sucessfully');
});

module.exports = {
    User: require('../doctors/doctor.model')
};
