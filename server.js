const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const app = express();
//Body parser middleware...
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//DB config
const db = require('./config/keys').mongoURI;
//Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch((err) => console.log(err));

//Passport setup with middleware
app.use(passport.initialize());

//Passport Configuration - JWT strategy
require('./config/passport')(passport);

//Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;
app.listen(port);
