const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const mod = require(path.join(__dirname,'Controller','script.js'));
// const db = require('./Model/database.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const db = mysql.createConnection({
    host: "kissanfarmserver.mysql.database.azure.com",
    user: "serveradmin@kissanfarmserver",
    password: "admin@123",
    database: "kissanfarm",
    port: 3306
});

app.use(session({
    "key": "number",
    "secret": "7&%&%$&434",
    "resave": false,
    "saveUninitialized": false,
    "cookie": {
        "expires": 60 * 60 * 24,
    },
})
);

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
    res.send("Hello");
});

app.get('/Loginask', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'loginask.html'));
});

app.get('/Signupask', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'signupask.html'));
});

app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'login.html'));
});

app.get('/Signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'signup.html'));
});

app.get('/Customerlogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'customerlogin.html'));
});

app.get('/uphaar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'signup.html'));
});

app.get('/Farmersell', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'signup.html'));
});

app.get('/Customerprofile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'signup.html'));
});

app.post('/Checksignup', (req, res) => {

    const number = req.body.number;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "INSERT INTO farmer (number, password) VALUES (?,?)",
            [number, hash],
            (err, result) => {
                console.log(err);
            }
        );
    })

    // if(account already exits)
    // Store it into database using bcrypt
});

app.post('/Checklogin', (req, res) => {

    const number = req.body.number;
    const password = req.body.password;

    db.query(
        "SELECT * FROM farmer WHERE number = ?;",
        number,
        (err, result) => {
            if (err) res.send({ err: err });
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.sendFile(path.join(__dirname, 'public', 'templates', 'Homefarmer.html'));
                    } else {
                        res.send({ message: "Wrong phone number/password combination!" });
                    }
                })
            } else {
                res.send({ message: "User does't exist" });
            }
        }
    );

});

app.get('/homefarmer', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'templates', 'Homefarmer.html'));
    }
    else res.sendFile(path.join(__dirname, 'public', 'templates', 'login.html'));
});











// app.get('/history',(req,res)=>{
//     db.processquery();
//     res.sendFile(path.join(__dirname,'View','history.html'));
// });

// app.get('/gethistory',(req,res)=>{
//     let obj=db.displayquery();
//     res.send(obj);
// })

// app.post('/api',(req,res)=>{
//     mod.search(req.body.tagname);
//     db.insertquery(req.body.tagname);
//     res.sendStatus(200);
// });

// app.get('/api2',(req,res)=>{
//     let arr=mod.getjson();
//     res.send(arr);
// });

app.listen(port);