const mongoose = require("mongoose");
const Bookings = require("./bookings");

const VehicleSchema = mongoose.Schema({
  carLicenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  Manufacturer: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  Baseprice: {
    type: Number,
    required: true,
  },
  Ratehourly: {
    type: Number,
    required: true,
  },
  SecurityAmount: {
    type: Number,
    required: true,
  },
  fromTime: {
    type: Number,
    min: 0,
    max: 2400,
  },
  endTime: {
    type: Number,
    min: 0,
    max: 2400,
  },
  IsAllocated: {
    type: Boolean,
    default: false,
  },
  Allocatedto: {
    type: String,
  },
  booked: [Bookings],
});

const Vehicle = mongoose.model("vehicle", VehicleSchema);

module.exports = Vehicle;
