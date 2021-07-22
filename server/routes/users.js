"use strict";
const express = require('express');
let router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const utils = require('../lib/utils')
const fs = require('fs');
const convert = require('xml-js');


const initializePassport = require("../config/passportConfig");
initializePassport(passport);
const { pool } = require("../config/dbConfig");

const multer = require('multer');
var storage_profile = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/src/assets/public/profile_pics/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload_profile = multer({ storage: storage_profile })

router.post('/login', function(req, res, next) {
    (req.body);
    var email = req.body.email;
    var password = req.body.password;
    pool.query(`SELECT * FROM  users WHERE username=$1`, [email], (err, results) => {
        if (err) {
            throw err => done(err, null);
        }
        (results.rows);
        if (results.rows.length > 0) {
            const user = results.rows[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }

                if (isMatch) {
                    const JWTtoken = utils.issueJWT(user);
                    var level = 1;
                    if (user.is_host) {
                        level = 2;
                    } else if (user.is_admin) {
                        level = 3;
                    }
                    res.status(200).json({ success: true, token: JWTtoken.token, expires: JWTtoken.expires, level: level });
                } else {
                    res.status(499).send('Password is incorrect');
                }
            })
        } else {
            res.status(498).send('Username not registered');
        }
    });
});

router.post('/update-password', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    let user_id = req.user.user_id;
    var old_password = req.body.old_password;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    let hashedPassword = await bcrypt.hash(password1, 10);
    pool.query(`SELECT * FROM  users WHERE user_id=$1`, [user_id], (err, results) => {
        if (err) {
            res.status(500).send();
        }
        (results.rows);
        if (results.rows.length > 0) {
            const user = results.rows[0];

            bcrypt.compare(old_password, user.password, (err, isMatch) => {
                if (err) {
                    res.status(500).send();
                }
                if (isMatch) {
                    if (password1 != password2) {
                        res.status(499).send('Passwords do not match');
                    } else if (password1.length < 6) {
                        res.status(499).send('Password should be at least 6 characters');
                    } else {
                        pool.query(`UPDATE users set password=$1 where user_id=$2`, [hashedPassword, user_id], (err, results) => {
                            if (err) {
                                res.status(500).send();
                            }
                            res.status(200).json();
                        })
                    }
                } else {
                    res.status(499).send('Old password is incorrect');
                }
            })
        } else {
            res.status(500).send();
        }
    });
});

router.post('/register', async function(req, res, next) {

    let { name, email, password, password2, phone, HostApplication } = req.body;
    ({
        name,
        email,
        password,
        password2,
        phone,
        HostApplication
    });

    var host_application = "false";
    if (HostApplication) {
        host_application = "true";
    }

    let errors = [];


    //Valisdation successful
    let hashedPassword = await bcrypt.hash(password, 10);
    (hashedPassword);

    pool.query('SELECT * FROM users WHERE email = $1 ', [email], (err, results) => {
        if (err) {
            throw err;
        }
        (results.rows);

        if (results.rows.length > 0) {
            // errors.push({ message: "Email already exists" });
            // res.json({ errors });
            res.status(499).send('Email already exists');
            // res.status(400).send({ message: 'Email already exists' });
        } else {
            pool.query('SELECT * FROM users WHERE username = $1 ', [name], (err, results) => {
                if (err) {
                    throw err;
                }
                (results.rows);

                if (results.rows.length > 0) {
                    // res.status(400).send({ message: "Username already in use" });
                    // errors.push({ message: "Username already in use" });
                    // res.json({ errors });
                    res.status(499).send('Username already in use');
                } else if (password != password2) {
                    // errors.push({ message: "Passwords do not match" });
                    res.status(499).send('Passwords do not match');
                } else if (password.length < 6) {
                    // errors.push({ message: "Password should be at least 6 characters" });
                    res.status(499).send('Password should be at least 6 characters');
                } else if (phone.length < 10) {
                    res.status(499).send('Phone should be 10 characters');
                } else if (errors.length > 0) {
                    res.status(499).send('Password should be at least 6 characters');
                } else {
                    pool.query(
                        `INSERT INTO users (is_admin, is_host,host_appl, username, email, password, profile_pic, phone)
                            VALUES (false,false,$5,$1,$2,$3,'default.png',$4)
                            RETURNING *`, [name, email, hashedPassword, phone, host_application],
                        (err, results) => {
                            if (err) {
                                throw err
                            }
                            (results.rows);

                            const user = results.rows[0];
                            const jwt = utils.issueJWT(user)

                            res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
                        }
                    )
                }
            });
        }
    });


});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let user_id = req.user.user_id;
    pool.query(`SELECT * 
                FROM users u 
                WHERE u.user_id= $1`, [user_id], (error, results) => {
        if (error) {
            res.status(500).send();
        }
        res.status(200).json({ user: results.rows[0] });
    });
});

router.get('/profile/my-messages', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let user_id = req.user.user_id;
    pool.query(`SELECT u.username,m.about,m.date,m.text,u.profile_pic,m.message_id
    FROM messages m,users u
    WHERE m.sender=$1 AND m.receiver=u.user_id order by m.date desc`, [user_id], (error, out_results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            pool.query(`SELECT u.username,m.about,m.date,m.text,u.profile_pic,u.user_id,m.message_id
            FROM messages m,users u
            WHERE m.receiver=$1 AND m.sender=u.user_id order by m.date desc`, [user_id], (error, in_results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(200).json({ in: in_results.rows, out: out_results.rows });
                }
            });
        }
    });
});

router.post('/profile/my-messages/send', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let from = req.user.user_id;
    let now_time = Date.now();
    var date = new Date(now_time);
    var to = req.body.to;
    var about = req.body.about;
    var message = req.body.message;
    (to, about, message)
    var sql = `insert into messages(sender,receiver,about,text,date) values($1,$2,$3,$4,$5)`;
    pool.query(sql, [from, to, about, message, date], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send();
        }
    });
});

router.post('/profile/my-messages/delete', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    var sql = `delete from messages where message_id=$1`;
    pool.query(sql, [req.body.id], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send();
        }
    });
});


router.get('/profile/my-stays', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let user_id = req.user.user_id;
    pool.query(`SELECT distinct h.house_id,h.images,h.house_name 
                FROM houses h, reservations r
                WHERE r.renter_id= $1 AND r.house_reserved=h.house_id and h.house_id 
                NOT IN(select h2.house_id from houses h2,reviews rv where rv.reviewer_id=$1 and h2.house_id=rv.house_id)`, [user_id], (error, results1) => {
        if (error) {
            res.status(500).send();
        }
        pool.query(`SELECT distinct h.house_id,h.images ,h.house_name,rv.grade
                    FROM houses h, reservations r,reviews rv
                    WHERE r.renter_id=$1 AND r.house_reserved=h.house_id and h.house_id=rv.house_id and rv.reviewer_id=$1`, [user_id], (error, results2) => {
            if (error) {
                res.status(500).send();
            }
            res.json({ not_reviewed: results1.rows, reviewed: results2.rows });
        });
    });
});

router.post('/profile/my-stays/review', passport.authenticate('jwt', { session: false }), (req, res) => {
    let user_id = req.user.user_id;
    let house_id = req.body.house_id;
    let grade = req.body.grade;
    let comment = req.body.comment;
    if (!house_id) {
        res.status(499).send('No house id given')
    } else if (!grade) {
        res.status(499).send('No grade given')
    } else if (!comment) {
        res.status(499).send('No comment given')
    } else {
        var sql = `insert into reviews(reviewer_id,house_id,grade,text) values($1,$2,$3,$4)`;
        pool.query(sql, [user_id, house_id, grade, comment], (error, results) => {
            if (error) {
                res.status(500).send()
            }
            res.status(200).send()
        });
    }
})

router.post('/profile/host_appl', passport.authenticate('jwt', { session: false }), (req, res) => {
    let user_id = req.user.user_id;
    pool.query(`update users set host_appl='true' where user_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
    });
    res.status(200).send();
})

router.post('/profile/update-pic', passport.authenticate('jwt', { session: false }), upload_profile.single("file"), (req, res, next) => {
    let user_id = req.user.user_id;
    const file = req.file(file.filename);
    if (!file) {
        res.status(497).send('Upload a file first');
    } else {
        pool.query(`update users set profile_pic=$1 where user_id=$2`, [file.filename, user_id], (error, results) => {
            if (error) {
                res.status(500).send('Server error');
            }
            res.status(200).send('Done');
        });
    }
});

router.get('/host_page', passport.authenticate('jwt', { session: false }), proctectHostRoute, (req, res, next) => {
    let id = req.user.user_id;
    pool.query(`SELECT * 
                FROM hosts_houses h1 , houses h
                WHERE h1.host_id=$1 AND h1.house_id=h.house_id `, [id], (error, results) => {
        if (error) {
            res.status(500).send();
        }

        res.json({ houses: results.rows });
    });
});

router.get('/admin_page', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res, next) => {
    pool.query(`SELECT * 
        FROM users WHERE email!='admin' `, (error, results) => {
        if (error) {
            res.status(500).send();
        }
        res.json({
            applications: results.rows
        })
    });
});

router.post('/admin_page/accept', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    let user_id = req.body.id;
    pool.query(`update users set is_host='true', host_appl='false' where user_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
    });
    res.status(200).send();
})

router.post('/admin_page/reject', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    let user_id = req.body.id;
    pool.query(`update users set is_host='false', host_appl='false' where user_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
    });
    res.status(200).send();
})

router.get('/admin_page/print_houses', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    pool.query(`select * from houses`, (error, results) => {
        if (error) { res.status(500).send(); }
        let json = JSON.stringify(results.rows);
        let name = 'houses-' + Date.now();
        fs.writeFile('../exported-data/json/' + name + '.json', json, (err) => {
            if (err) res.status(500).send();
            ('Data written to json file');
            res.status(200).send();
        });
        var options = { compact: true, ignoreComment: true, spaces: 4 };
        var xml = convert.json2xml(json, options);
        fs.writeFile('../exported-data/xml/' + name + '.xml', xml, (err) => {
            if (err) res.status(500).send();
            ('Data written to xml file');
            res.status(200).send();
        });
    });
})

router.get('/admin_page/print_users_res/:id', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    let user_id = req.params.id;
    pool.query(`select * from reservations where renter_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
        let json = JSON.stringify(results.rows);
        let name = 'users-' + user_id + '-reservations-' + Date.now();
        fs.writeFile('../exported-data/json/' + name + '.json', json, (err) => {
            if (err) res.status(500).send();
            ('Data written to json file');
            res.status(200).send();
        });
        var options = { compact: true, ignoreComment: true, spaces: 4 };
        var xml = convert.json2xml(json, options);
        fs.writeFile('../exported-data/xml/' + name + '.xml', xml, (err) => {
            if (err) res.status(500).send();
            ('Data written to xml file');
            res.status(200).send();
        });
    });
})

router.get('/admin_page/print_users_rev/:id', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    let user_id = req.params.id;
    pool.query(`select * from reviews where reviewer_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
        let json = JSON.stringify(results.rows);
        let name = 'users-' + user_id + '-reviews-' + Date.now();
        fs.writeFile('../exported-data/json/' + name + '.json', json, (err) => {
            if (err) res.status(500).send();
            ('Data written to json file');
            res.status(200).send();
        });
        var options = { compact: true, ignoreComment: true, spaces: 4 };
        var xml = convert.json2xml(json, options);
        fs.writeFile('../exported-data/xml/' + name + '.xml', xml, (err) => {
            if (err) res.status(500).send();
            ('Data written to xml file');
            res.status(200).send();
        });
    });
})

router.get('/admin_page/print_hosts_rev/:id', passport.authenticate('jwt', { session: false }), proctectAdminRoute, (req, res) => {
    let user_id = req.params.id;
    pool.query(`select r.* from reviews r,hosts_houses h where r.house_id=h.house_id AND h.host_id=$1`, [user_id], (error, results) => {
        if (error) { res.status(500).send(); }
        let json = JSON.stringify(results.rows);
        let name = 'hosts-' + user_id + '-reviews-' + Date.now();
        fs.writeFile('../exported-data/json/' + name + '.json', json, (err) => {
            if (err) res.status(500).send();
            ('Data written to json file');
            res.status(200).send();
        });
        var options = { compact: true, ignoreComment: true, spaces: 4 };
        var xml = convert.json2xml(json, options);
        fs.writeFile('../exported-data/xml/' + name + '.xml', xml, (err) => {
            if (err) res.status(500).send();
            ('Data written to xml file');
            res.status(200).send();
        });
    });
})

function proctectAdminRoute(req, res, next) {
    if (req.user.is_admin == true) {
        next();
    } else {
        return res.status(499).send('Not an admin');
    }
}

function proctectHostRoute(req, res, next) {
    if (req.user.is_host == true) {
        next();
    } else {
        return res.status(498).send('Not a host');
    }
}

module.exports = router;