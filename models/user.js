const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  placeOfBirth: {
    type: String,
    default: 'Place of Birth',
    // required: [true, 'Place of Birth is required'],
  },
  maritalStatus: {
    type: String,
    // required: [true, 'Marital Status is required'],
    enum: ['Single', 'In a Relationship', 'Married', 'Divorced', 'Widowed'],
    default: 'Single',
  },
  gender: {
    type: String,
    required: false, 
    enum: [
      'Male', 'Female', 'Transgender', 'Non-Binary', 'Genderqueer',
      'Genderfluid', 'Bigender', 'Agender', 'Pangender', 'Neutrois',
      'Androgyne', 'Demiboy', 'Demigirl', 'Two-Spirit', 'Third Gender',
      'Other'
    ],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email is invalid",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("users", userSchema);
