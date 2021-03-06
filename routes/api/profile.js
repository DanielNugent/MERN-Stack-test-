const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const validateProfileFields = require("../../validation/profile");
const validateExperienceFields = require("../../validation/experience");
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
      .populate("user", ["first_name", "last_name", "avatar"])
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
// @route    GET api/profile/handle/:handle
// @desc     Get the profile with the associated handle
// @access   Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["first_name", "last_name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this handle";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//PROFILE
// @route    GET api/profile/user/:user_id
// @desc     Get the profile with associated user id
// @access   Public
router.get("/user/:id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.id })
    .populate("user", ["first_name", "last_name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this id";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile with this id";
      res.status(404).json(errors);
    });
});
//PROFILE
// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["first_name", "last_name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profiles";
        return res.status(404).json(errors);
      } else res.json(profiles);
    })
    .catch(() => {
      errors.noprofile = "No profiles";
      return res.status(404).json(errors);
    });
});
//PROFILE
// @route    POST api/profile/experience
// @desc     Add a new experience
// @access   Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceFields(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const experience = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        //add to beggining of experiences
        profile.experience.unshift(experience);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);
//PROFILE
// @route    POST api/profile/connections
// @desc     Add a new connection (request)
// @access   Private
router.post(
  "/connections/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile for specified user";
          return res.status(404).json(errors);
        }
        Profile.findOne({ handle: req.body.handle }).then(connection => {
          if (!connection) {
            errors.noprofile = "No profile";
            res.status(404).json(errors);
          }
          if(profile.outgoingrequests.includes(connection.user)){
            console.log("already sending!");
            return res.status(400).json({profile: "already waiting for connection request!"});
          }
          profile.outgoingrequests.unshift(connection.user);
          profile.save().then(() => {
            connection.incomingrequests.unshift(profile.user);
            connection.save().then(connection => res.json({ message: "success" }));
          });
        });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);
//PROFILE
// @route    POST api/profile/connections/accept
// @desc     Add a new connection (request)
// @access   Private
router.post(
  "/connections/accept",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile for specified user";
          return res.status(404).json(errors);
        }
        Profile.findOne({ user: req.body.id }).then(connection => {
          if (!connection) {
            errors.noprofile = "No profile";
            res.status(404).json(errors);
          }
          profile.incomingrequests = profile.incomingrequests.filter(
            increq => toString(increq) != toString(req.body.id)
          );
          profile.outgoingrequests = profile.outgoingrequests.filter(
            outreq => toString(outreq) != toString(req.body.id)
          );
          connection.outgoingrequests = connection.outgoingrequests.filter(
            outreq => toString(outreq) != toString(profile.user)
          );
          connection.incomingrequests = connection.incomingrequests.filter(
            increq => toString(increq) != toString(profile.user)
          );
  //        console.log(toString(profile.user).localCompare(connection.incomingrequests[0]));
          connection.connections = [];
          profile.connections = [];
          profile.save().then(() => {
            connection.save().then(connection => res.json(profile));
          });
        });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);
//PROFILE
// @route    GET api/profile/connections
// @desc     Get all connections
// @access   Private
router.get(
  "/connections/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile for specified user";
          return res.status(404).json(errors);
        }
        return res.json(profile.connections);
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
