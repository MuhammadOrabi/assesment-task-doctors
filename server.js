require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
// app.use('/api/doctors', require('./doctors/doctors.controller'));

require('./doctors/doctor.rabbitmq');

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT ? process.env.PORT : 3000;
if (!module.parent) {
    const server = app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });
}
module.exports = app;