const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  //URL to their profile, similar to twitter handle @Xxxxxx
  handle: {
    type: String,
    required: true,
    max: 30
  },
  college: {
    type: String
  },
  degree: {
    type: String
  },
  //ie 2nd year in college etc
  year: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  connections: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  incomingrequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  outgoingrequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
