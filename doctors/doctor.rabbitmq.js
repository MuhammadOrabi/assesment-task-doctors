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
