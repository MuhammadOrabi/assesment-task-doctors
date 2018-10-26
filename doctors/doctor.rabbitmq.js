const axios = require('axios');
const _ = require('underscore');
const rabbitmq = require('_helpers/rabbitmq');
const doctorService = require('./doctor.service');

rabbitmq.getFromMQ('front', 'doctor.create', msg => {
    let doctor = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.create');
    doctorService.create(doctor)
    .then(() => {
        rabbitmq.sendToMQ('doctor.created', doctor);
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.create.error', {err: err});
        throw err;
    });
});


rabbitmq.getFromMQ('front', 'doctor.authenticate', msg => {
    let doctor = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.authenticate');
    doctorService.authenticate(doctor)
    .then(doctor => {
        if (doctor) {
            rabbitmq.sendToMQ('doctor.authenticated', doctor);            
        } else {
            rabbitmq.sendToMQ('doctor.authenticate.error', {err: 'Check your credentials!'});            
        }
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.authenticate.error', {err: err});
        throw err;
    });
});

rabbitmq.getFromMQ('front', 'doctor.get.all', msg => {
    console.log("[doctor] %s",'doctor.get.all');
    doctorService.getAll()
    .then(doctors => {
        if (doctors) {
            rabbitmq.sendToMQ('doctor.got.all', doctors);            
        } else {
            rabbitmq.sendToMQ('doctor.get.all.error', {err: 'something went wrong!'});            
        }
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.get.all.error', {err: err});
        throw err;
    });
});

rabbitmq.getFromMQ('front', 'doctor.get.avail.day', async msg => {
    let params = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.get.avail.day');
    doctorService.getByIdAndAvail(params.id, params.day)
    .then(doctor => {
        if (doctor) {
            rabbitmq.sendToMQ('doctor.got.avail.day', doctor);            
        } else {
            rabbitmq.sendToMQ('doctor.get.avail.day.error', {err: 'something went wrong!'});            
        }
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.get.avail.day.error', {err: err});
        throw err;
    });
});