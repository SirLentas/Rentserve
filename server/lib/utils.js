const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PRIV_KEY = fs.readFileSync('keys/id_rsa_priv.pem', 'utf8');

function issueJWT(user) {
    const email = user.email;
    // (user);

    var level = 1;
    if (user.is_host == true) {
        level = 2;
    }
    if (user.is_admin == true) {
        level = 3;
    }
    const expiresIn = '1d';

    const payload = {
        sub: email,
        level: level,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}


module.exports.issueJWT = issueJWT;