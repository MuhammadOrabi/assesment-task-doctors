const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Doctor = db.Doctor;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const doctor = await Doctor.findOne({ username });
    if (doctor && bcrypt.compareSync(password, doctor.hash)) {
        const token = jwt.sign({ sub: doctor.id }, config.secret);
        return {
            id: doctor.id,
            jwt_token: token
        };
    }
}

async function getAll() {
    return await Doctor.find().select('-hash');
}

async function getById(id) {
    return await Doctor.findById(id).select('-hash');
}

async function create(doctorParam) {
    // validate
    if (await Doctor.findOne({ username: doctorParam.username })) {
        throw 'Username "' + doctorParam.username + '" is already taken';
    }

    const doctor = new Doctor(doctorParam);

    // hash password
    if (doctorParam.password) {
        doctor.hash = bcrypt.hashSync(doctorParam.password, 10);
    }

    // save doctor
    await doctor.save();
}

async function update(id, doctorParam) {
    const doctor = await Doctor.findById(id);

    // validate
    if (!doctor) throw 'Doctor not found';
    if (doctor.username !== doctorParam.username && await Doctor.findOne({ username: doctorParam.username })) {
        throw 'Username "' + doctorParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (doctorParam.password) {
        doctorParam.hash = bcrypt.hashSync(doctorParam.password, 10);
    }

    // copy doctorParam properties to doctor
    Object.assign(doctor, doctorParam);

    await doctor.save();
}

async function _delete(id) {
    await Doctor.findByIdAndRemove(id);
}
