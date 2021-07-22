const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const passport = require("passport");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const PUB_KEY = fs.readFileSync("keys/id_rsa_pub.pem", 'utf-8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const stategy = new JwtStrategy(options, (payload, done) => {
    (payload.sub + " with AuthLevel " + payload.level);
    pool.query(`SELECT * FROM  users WHERE email=$1`, [payload.sub], (err, results) => {
        if (err) {
            throw err => done(err, null);
        }
        (results.rows);
        if (results.rows.length > 0) {
            const user = results.rows[0];
            if (err) {
                throw err;
            }
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

module.exports = (passport) => {
    passport.use(stategy);
};