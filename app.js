require('dotenv').config();

const express = require("express");
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

console.log(process.env.API_KEY);
app.set('view engine', 'ejs');
mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true }).then(() => {
    console.log("connected");
})
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


// encrpt we called save and descrpyt we call find
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (err)
            console.log(err);
        else res.render("secrets")
    })
    console.log(req.body);
    res.render("secrets")
})


app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err)
            console.log(err);
        else {
            if (foundUser) {
                if (password === foundUser.password)
                    res.render("secrets")
            }
        }
    })
})










app.get('/', function (req, res) {
    res.render("home")
})
app.get('/login', function (req, res) {
    res.render("login")
})

app.get('/register', function (req, res) {
    res.render("register")
})






app.listen(3000, function () {
    console.log("running in http://localhost:3000/");
})