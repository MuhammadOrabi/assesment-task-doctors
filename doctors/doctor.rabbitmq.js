const rabbitmq = require('_helpers/rabbitmq');
const doctorService = require('./doctor.service');
const config = require('config');
const jwt = require('jsonwebtoken');

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

rabbitmq.getFromMQ('front', 'doctor.get.by.id', msg => {
    let params = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.get.by.id');
    doctorService.getById(params.id)
    .then(doctor => {
        if (doctor) {
            rabbitmq.sendToMQ('doctor.got.by.id', doctor);            
        } else {
            rabbitmq.sendToMQ('doctor.get.by.id.error', {err: 'something went wrong!'});            
        }
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.get.by.id.error', {err: err});
        throw err;
    });
});

rabbitmq.getFromMQ('front', 'doctor.update', msg => {
    let params = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.update');
    let decoded = jwt.verify(params.token, config.secret);

    doctorService.update(decoded.sub, params.doctor)
    .then(() => {
        doctorService.getById(decoded.sub)
            .then(doctor => {
                if (!doctor) {
                    return rabbitmq.sendToMQ('doctor.update.error', {err: 'Not Found!'});               
                }
                rabbitmq.sendToMQ('doctor.updated', doctor);
            })
            .catch(err => {
                rabbitmq.sendToMQ('doctor.update.error', {err: err});
                throw err;
            });
    })
    .catch(err => {
        rabbitmq.sendToMQ('doctor.update.error', {err: err});
        throw err;
    });
});

rabbitmq.getFromMQ('front', 'doctor.delete', msg => {
    let params = JSON.parse(msg.content.toString());
    console.log("[doctor] %s",'doctor.delete');
    let decoded = jwt.verify(params.token, config.secret);
    doctorService.delete(decoded.sub)
        .then(() => {
            rabbitmq.sendToMQ('doctor.deleted', {});
        })
        .catch(err => {
            rabbitmq.sendToMQ('doctor.delete.error', {err: err});
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