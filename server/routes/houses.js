"use strict";
const express = require('express');
let router = express.Router();
const passport = require("passport");
const { pool } = require("../config/dbConfig");
const initializePassport = require("../config/passportConfig");
initializePassport(passport);

const util = require("util");
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../client/src/assets/public/house_pics/');
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }
        callback(null, file.fieldname + '-' + Date.now());
    }
});

router.get('/:id', (req, res) => {
    let house_id = req.params.id;

    pool.query(`SELECT *,
    (SELECT AVG(r.grade) FROM reviews r WHERE h2.house_id=r.house_id AND h2.house_id=h1.house_id) AS AvgRating
    FROM houses h1,hosts_houses h2,users u
    WHERE h1.house_id= $1 AND h1.house_id=h2.house_id and h2.host_id=u.user_id`, [house_id], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        }

        var sql2 = `select avg(r.grade),count(distinct review_id) from reviews r,hosts_houses h where h.house_id=r.house_id and h.host_id=$1`;

        pool.query(sql2, [results.rows[0].host_id], (error, results2) => {
            if (error) {
                res.status(500).send('Server error');
            }
            var avg = 0;
            var count = 0;
            if (results2.rows[0].count > 0) {
                avg = results2.rows[0].avg;
                count = results2.rows[0].count;
            }
            pool.query(`SELECT u.username,r.grade,r.text FROM users u, reviews r WHERE r.reviewer_id=u.user_id AND r.house_id=$1 order by r.review_id desc`, [house_id], (error, results3) => {
                if (error) {
                    res.status(500).send('Server error');
                }
                res.status(200).json({ house: results.rows[0], avg: Math.round(avg * 100) / 100, count: count, reviews: results3.rows })
            });
        });


    });
});

router.get('/:id/:from/:to/:guests', (req, res) => {
    let id = req.params.id;
    let from = req.params.from;
    let to = req.params.to;
    let guests = req.params.guests;

    var res1 = from.split("-");
    var indate1 = res1[1] + "/" + res1[2] + "/" + res1[0];
    var res2 = to.split("-");
    var outdate1 = res2[1] + "/" + res2[2] + "/" + res2[0];
    var date1 = new Date(indate1);
    var date2 = new Date(outdate1);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    pool.query(`SELECT *
    FROM houses h1 
    WHERE h1.capacity >= $1 AND h1.house_id=$2
    AND h1.house_id NOT IN 
    (   SELECT h2.house_id 
        FROM houses h2 
        INNER JOIN reservations r ON h2.house_id = r.house_reserved 
        WHERE ($3 < r.in_date AND $4 > r.out_date)
        OR ( $3 < r.in_date AND $4 > r.in_date AND $4 <= r.out_date)
        OR ( $3 >= r.in_date AND $3 < r.out_date AND $4 > r.out_date)
        OR ( $3 >= r.in_date AND $4 <= r.out_date)
        )
    AND $3>=h1.available_from AND $4<=h1.available_to AND h1.min_days<=$5`, [guests, id, from, to, Difference_In_Days], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        }
        if (results.rowCount > 0) {
            res.status(200).send('Available');
        } else {
            res.status(496).send('Unavailable');
        }
    });
});

router.post('/reserve', passport.authenticate('jwt', { session: false }), (req, res) => {
    var sql = `insert into reservations (house_reserved,in_date,out_date,renter_id) values ($1,$2,$3,$4)`;
    pool.query(sql, [req.body.house, req.body.from, req.body.to, req.body.renter_id], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        }
        res.status(200).send();
    });
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
const upload = util.promisify(uploadFiles);
router.post('/add-listing/photos', passport.authenticate('jwt', { session: false }), proctectHostRoute, async (req, res) => {
    try {
        await upload(req, res);
        (req.files);

        if (req.files.length <= 0) {
            res.status(491).send(`You must select at least 1 file.`);
        }

        const files = req.files;
        var index, len;
        var images = "{";

        for (index = 0, len = files.length; index < len; ++index) {
            images = images + '"' + files[index].filename + '"';
            if (index < len - 1) {
                images = images + ",";
            }
        }

        images = images + "}";

        res.status(200).json({ jsonIm: images });
    } catch (error) {
        (error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            res.status(490).send("Too many files to upload.");
        }
        res.status(490).send(`Error when trying upload many files: ${error}`);
    }
})

router.post('/add-listing', passport.authenticate('jwt', { session: false }), proctectHostRoute, (req, res) => {
    let user_id = req.user.user_id;
    var sql = `insert into houses (country,city,adress,capacity,available_from,available_to,house_name ,size ,cost,house_type ,heating ,wifi,cooling,oven,tv,parking,elevator,description,min_days,extra_info,images,lat,lng)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) returning house_id`;

    var wifi = 'false';
    if (req.body.wifi) {
        wifi = 'true';
    }
    var heating = 'false';
    if (req.body.heating) {
        heating = 'true';
    }
    var cooling = 'false';
    if (req.body.cooling) {
        cooling = 'true';
    }
    var oven = 'false';
    if (req.body.oven) {
        oven = 'true';
    }
    var tv = 'false';
    if (req.body.tv) {
        tv = 'true';
    }
    var parking = 'false';
    if (req.body.parking) {
        parking = 'true';
    }
    var elevator = 'false';
    if (req.body.elevator) {
        elevator = 'true';
    }
    pool.query(sql, [req.body.country, req.body.city, req.body.address, req.body.capacity, req.body.a_from, req.body.a_to, req.body.name, req.body.size, req.body.cost, req.body.h_type, heating, wifi, cooling, oven, tv, parking, elevator, req.body.des, req.body.min_days, req.body.info, req.body.images, req.body.lat, req.body.lng], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        }
        // (results)
        var sql2 = `insert into hosts_houses (house_id,host_id) values ($1,$2)`;
        pool.query(sql2, [results.rows[0].house_id, user_id], (err, res) => {
            if (err) {
                res.status(500).send('Server error');
            }
        });
        res.status(200).json({ ok: 'Added' });
    });
})

router.post('/edit-listing', passport.authenticate('jwt', { session: false }), proctectHostRoute, (req, res) => {

    var sql = `UPDATE houses SET capacity=$1,available_from=$2,available_to=$3, cost=$4,heating=$5 ,wifi=$6,cooling=$7,oven=$8,tv=$9,
    parking=$10,elevator=$11,description=$12,min_days=$13,extra_info=$14,images=$15 WHERE house_id=$16`;

    var wifi = 'false';
    if (req.body.wifi) {
        wifi = 'true';
    }
    var heating = 'false';
    if (req.body.heating) {
        heating = 'true';
    }
    var cooling = 'false';
    if (req.body.cooling) {
        cooling = 'true';
    }
    var oven = 'false';
    if (req.body.oven) {
        oven = 'true';
    }
    var tv = 'false';
    if (req.body.tv) {
        tv = 'true';
    }
    var parking = 'false';
    if (req.body.parking) {
        parking = 'true';
    }
    var elevator = 'false';
    if (req.body.elevator) {
        elevator = 'true';
    }
    pool.query(sql, [req.body.capacity, req.body.a_from, req.body.a_to, req.body.cost, heating, wifi, cooling, oven, tv, parking, elevator, req.body.des, req.body.min_days, req.body.info, req.body.images, req.body.id], (error, results) => {
        if (error) {
            res.status(500).send('Server error');
        }
        res.status(200).json({ ok: 'Edited' });
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