const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWTKey = require("../../config/keys").secretJWTKey;
const passport = require("passport");


const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
//User Model

const User = require("../../models/User");

//TEST
// @route    GET api/users/test
// @desc     Tests the users route
// @access   Public
router.get("/test", (req, res) => res.json({ message: "Users works" }));

//REGISTER
// @route    POST api/users/register {first_name: required, last_name: required, email: required, password: required}
// @desc     Register a new user
// @access   Public
router.post("/register", (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  if(!isValid){
     return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//LOGIN
// @route    POST api/users/login {email: required, password: required}
// @desc     Login an existing user
// @access   Public
router.post("/login", (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);
  if(!isValid){
     return res.status(400).json(errors);
  }
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    //check if user exists
    if (!user) {
      errors.email = 'Email doesn\'t exist';
      return res.status(404).json(errors);
    }
    //check password using bcryptjs
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //sign and generate jwt
        const payload = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar
        }; //JWT payload
        jwt.sign(payload, JWTKey, { expiresIn: "24h" }, (err, token) => {
          //one day expiry
          res.json({ success: true, token: "Bearer " + token });
        });
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});
//USER
// @route    POST api/users/user
// @desc     Return current user information
// @access   Private
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {first_name, last_name, email, avatar} = req.user;
    res.json({first_name, last_name, email, avatar});
  }
);

module.exports = router;
