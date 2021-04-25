const mongoose = require("mongoose");

const BookingsSchema = mongoose.Schema({
  carId: {
    type: String,
    required: true,
  },
  userId: { type: String, required: true },
  Model: { type: String, required: true },
  Manufacturer: { type: String, required: true },
  StartTime: { type: Date, required: true },
  EndTime: { type: Date, required: true },
  price: { type: Number, required: true },
});

module.exports = BookingsSchema;
