const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const validateProfileFields = require("../../validation/profile");
//Bring in User and Profile models
const User = require("../../models/User");
const Profile = require("../../models/Profile");
//TEST
// @route    GET api/profile/test
// @desc     Tests the profile route
// @access   Public
router.get("/test", (req, res) => res.json({ message: "Profile works" }));

//PROFILE
// @route    GET api/profile
// @desc     Get the current users profile
// @access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate('user', ['first_name', 'last_name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile for specified user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

//PROFILE
// @route    POST api/profile
// @desc     Modify the current user's profile
// @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileFields(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.college) profileFields.college = req.body.college;
    if (req.body.degree) profileFields.degree = req.body.degree;
    if (req.body.year) profileFields.year = req.body.year;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update existing profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, useFindAndModify: false }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle is already in use";
            res.status(400).json(errors);
          } else {
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

module.exports = router;
