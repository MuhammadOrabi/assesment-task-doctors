const rabbitmq = require('_helpers/rabbitmq');

const doctorService = require('./doctor.service');

rabbitmq.getFromMQ('front', 'doctor.create', msg => {
    let doctor = JSON.parse(msg.content.toString());
    console.log("[x] %s",'doctor.create');
    doctorService.create(doctor)
    .then(() => {
        rabbitmq.sendToMQ('doctor.created', doctor);
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.create.error', {err: 'error!'});
        throw err;
    });
});

rabbitmq.getFromMQ('doctors', 'doctor.created', msg => {
    let doctor = JSON.parse(msg.content.toString());
    console.log("[x] %s", 'doctor.created');
});


rabbitmq.getFromMQ('doctors', 'doctor.create.error', msg => {
    console.log("[x] %s", msg.content.toString());
});