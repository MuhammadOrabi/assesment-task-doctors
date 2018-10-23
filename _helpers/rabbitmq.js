const amqp = require('amqplib').connect('amqp://rabbitmq:rabbitmq@rabbit1:5672');

module.exports = {
    getFromMQ,
    sendToMQ
};


function getFromMQ(exchange, key, doAction, type='topic') {
    amqp.then(conn => {
        return conn.createChannel();
    }).then(ch => {
        ch.assertExchange(exchange, type, {durable: false}).then(ok => {
            return ch.assertQueue('', {exclusive: true}).then(q => {
                ch.bindQueue(q.queue, exchange, key).then(q => {
                    ch.consume(q.queue, doAction, {noAck: true});
                });
            });
        });
    }).catch(console.warn);
}

function sendToMQ(key, data, type='topic', exchange='doctors') {
    amqp.then(conn => {
        return conn.createChannel();
    }).then(ch => {
        return ch.assertExchange(exchange, type, {durable: false}).then(ok => {
            return ch.publish(exchange, key, new Buffer(JSON.stringify(data)));
        });
    }).catch(console.warn);
}