const amqp = require('amqplib').connect('amqp://rabbitmq:rabbitmq@rabbit1:5672');

module.exports = {
    getFromMQ,
    sendToMQ
};


function getFromMQ(exchange, op, callback, type='direct') {
    amqp.then(conn => {
        return conn.createChannel();
    }).then(ch => {
        ch.assertExchange(exchange, type, {durable: false}).then(ok => {
            return ch.assertQueue('', {exclusive: true}).then(q => {
                ch.bindQueue(q.queue, exchange, op).then(q => {
                    ch.consume(q.queue, callback, {noAck: true});
                });
            });
        });
    }).catch(console.warn);
}

function sendToMQ(op, data, type='direct', exchange='doctors') {
    amqp.then(conn => {
        return conn.createChannel();
    }).then(ch => {
        return ch.assertExchange(exchange, type, {durable: false}).then(ok => {
            return ch.publish(exchange, op, new Buffer(JSON.stringify(data)));
        });
    }).catch(console.warn);
}