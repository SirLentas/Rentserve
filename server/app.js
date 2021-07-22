const express = require('express');
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const cors = require('cors');
const { pool } = require("./config/dbConfig");
require('./config/passportConfig')(passport);
var url = require("url");
app.use(passport.initialize());
const users = require("./routes/users")
const houses = require("./routes/houses")
const port = 3000;
const https = require("https");
const fs = require('fs');

const options = {
    key: fs.readFileSync('../ssl/key.pem'),
    cert: fs.readFileSync('../ssl/cert.pem')
};

app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static("public"));
app.use("/users", users);
app.use("/houses", houses);


app.get('/', (req, res) => {
    let user1;
    if (req.isAuthenticated()) {
        user1 = req.user;
    } else {
        user1 = [];
    }
    req.session.redirectUrl = req.originalUrl;
    (req.session.redirectUrl);
    res.status(200).json({ isLoggedin: req.isAuthenticated(), user: user1 });
});

app.get('/search', (request, response, next) => {
    var q = url.parse(request.url, true).query;
    var location = q.location;
    var indate = q.arr_day;
    var outdate = q.dep_day;
    var adults = q.guests;

    var res1 = indate.split("-");
    var indate1 = res1[1] + "/" + res1[2] + "/" + res1[0];
    var res2 = outdate.split("-");
    var outdate1 = res2[1] + "/" + res2[2] + "/" + res2[0];
    var date1 = new Date(indate1);
    var date2 = new Date(outdate1);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    var mysql =
        `SELECT h1.house_id,h1.house_name,h1.country,h1.city,h1.house_type,h1.capacity,h1.images,h1.cost,
            (SELECT AVG(r.grade) FROM reviews r, hosts_houses hh WHERE hh.house_id=r.house_id AND hh.house_id=h1.house_id) AS AvgRating
            FROM houses h1 
            WHERE h1.capacity >= $1 AND (h1.country~~*$2 OR h1.city~~*$2 )
            AND h1.house_id NOT IN 
            (   SELECT h2.house_id 
                FROM houses h2 
                INNER JOIN reservations r ON h2.house_id = r.house_reserved 
                WHERE ($3 < r.in_date AND $4 > r.out_date)
                OR ( $3 < r.in_date AND $4 > r.in_date AND $4 <= r.out_date)
                OR ( $3 >= r.in_date AND $3 < r.out_date AND $4 > r.out_date)
                OR ( $3 >= r.in_date AND $4 <= r.out_date)
                )
            AND $3>=h1.available_from AND $4<=h1.available_to AND $3<$4`;

    mysql = mysql + " AND h1.min_days<=" + Difference_In_Days;
    var max = q.max;
    if (max) {
        mysql = mysql + " AND h1.cost<=" + max;
    }
    var min = q.min;
    if (min) {
        mysql = mysql + " AND h1.cost>=" + min;
    }
    var type = q.type;
    if (type) {
        if (type == "private") {
            mysql = mysql + " AND h1.house_type= 'private room'";
        } else if (type == "public") {
            mysql = mysql + " AND h1.house_type= 'public room'";
        } else if (type == "house") {
            mysql = mysql + " AND h1.house_type= 'house'";
        }
    }
    if (q.wifi == 'true') {
        mysql = mysql + " AND h1.wifi='true'";
    }
    if (q.oven == 'true') {
        mysql = mysql + " AND h1.oven='true'";
    }
    if (q.heating == 'true') {
        mysql = mysql + " AND h1.heating='true'";
    }
    if (q.cooling == 'true') {
        mysql = mysql + " AND h1.cooling='true'";
    }
    if (q.tv == 'true') {
        mysql = mysql + " AND h1.tv='true'";
    }
    if (q.parking == 'true') {
        mysql = mysql + " AND h1.parking='true'";
    }
    if (q.elevator == 'true') {
        mysql = mysql + " AND h1.elevator='true'";
    }

    var loc = '%' + location.substring(0, 3) + '%';

    pool.query(mysql, [adults, loc, indate, outdate], (error, results) => {
        if (error) {
            throw error;
        }
        response.json({ houses: results.rows })
    });
})

app.use(function(req, res, next) {
    res.status(404);
    res.type('txt').send('Page not found');
})

// app.listen(port, () => {
//     (`App running on port ${port}.`);
// });

https.createServer(options, app).listen(port, () => {
    (`App running on port ${port}.`);
});