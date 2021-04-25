const mongoose = require("mongoose");
const Bookings = require("./bookings");

const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
    maxLength: 30,
    minLength: 1,
    trim: true,
  },
  MobileNumber: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10,
    trim: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  booked: [Bookings],
});

/*
UserSchema.pre('save', function(doc, next) {
    // Add auth here
    next()
})
*/

const User = mongoose.model("use", UserSchema);

module.exports = User;
