const expressJwt = require('express-jwt');
const config = require('config.json');
const doctorService = require('../doctors/doctor.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/doctors/authenticate',
            '/doctors/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const doctor = await doctorService.getById(payload.sub);

    // revoke token if doctor no longer exists
    if (!doctor) {
        return done(null, true);
    }

    done();
};
