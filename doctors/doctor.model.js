const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, index: true, unique: true, required: true },
    hash: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    appointment_time: { type: String, required: true },
    work: [{day: String, from: String, to: String}],
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Doctor', schema);
