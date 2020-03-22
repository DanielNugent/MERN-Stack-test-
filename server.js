const express = require("express");
const mongoose = require("mongoose");

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

const app = express();
//DB config
const db = require('./config/keys').mongoURI;
//Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch((err) => console.log(err));


app.get("/", (req, res) => res.send("Hello"));
//Routes
app.use('/api/users', users);
app.use('/api/profile', profile);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`On port ${port}`));
