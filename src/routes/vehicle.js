const express = require("express");
const Vehicle = require("../models/vehicle");
const User = require("../models/user");
const QueryBuilder = require("../utils/query");
const CarRouter = express.Router();

CarRouter.post("", async (req, res) => {
  try {
    const car = new Vehicle({ ...req.body });
    await car.save();
    return res.status(200).send({ car, message: "Vehicle Added" });
  } catch (err) {
    console.error(err);
    if (err.name == "ValidationError") {
      return res.status(400).send({ message: "User body is not valid" });
    }
    if (err.name == "MongoError") {
      return res.status(400).send({
        message: "carLicenseNumber is alreasy used for other vehicle",
      });
    }
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

CarRouter.patch("/:id", async (req, res) => {
  try {
    const car = await Vehicle.findByIdAndUpdate(req.params.id, { ...req.body });
    if (!car) {
      return res.status(400).send({ message: "Car not found" });
    }
    return res.status(200).send({ message: "Car Updated", car });
  } catch (err) {
    console.log(err.name);
    if (err.name == "CastError") {
      return res.status(400).send({ message: "Car ID Not Valid" });
    }
    if (err.name == "MongoError") {
      return res.status(400).send({ message: "Car NumberPlate is not unique" });
    }
    if (err.name == "ValidationError") {
      return res.status(400).send({ message: "Car Update body is not valid" });
    }
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

CarRouter.delete("/:id", async (req, res) => {
  try {
    const car = await Vehicle.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(400).send({ message: "Unable to delete" });
    }
    return res.status(200).send({ message: "Car Deleted" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

CarRouter.get("/calculate-price/:id", async (req, res) => {
  try {
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const timefor = (endTime - startTime) / 60 / 60;
    const car = await Vehicle.findById(req.params.id);
    if (!car) {
      return res.status(400).message({ message: "Incorrect" });
    }
    const price = car.Baseprice + car.Ratehourly * timefor;
    return res.status(200).send({ price, timefor, car });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

//TODO
CarRouter.get("/search-cars/", async (req, res) => {
  try {
    const query = QueryBuilder(req.body);
    const cars = await Vehicle.find(query);
    res.send(cars);
    //seatch car in price range
    //search cars in time range
    //search car by brand
    //search car by model
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

CarRouter.get("/bookings/:id/", async (req, res) => {
  try {
    const car = await Vehicle.findById(req.params.id);
    if (!car) {
      return res.status(400).send({ message: "Car ID incorrect" });
    }
    return res.status(200).send({ bookings: car.booked });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

CarRouter.post("/book/:carid/:userid", async (req, res) => {
  try {
    if (req.body.startTime > req.body.endTime) {
      return res
        .status(400)
        .send({ message: "Start tome cannot be greater than end time" });
    }
    const car = await Vehicle.findById(req.params.carid);
    const user = await User.findById(req.params.userid);
    if (!car && !user) {
      return res.status(400).send({ message: "Car or user ID incorrect" });
    }
    if (car.IsAllocated) {
      return res.status(400).send({ message: "Car is already allocated" });
    }
    if (req.body.endTime > car.endTime && car.fromTime < req.body.startTime) {
      return res
        .status(400)
        .send({ message: "Car not served for user timings" });
    }
    const timefor = req.body.endTime - req.body.startTime;
    const price = car.Baseprice + car.Ratehourly * timefor;
    console.log({ price });
    const booking = {
      carId: req.params.carid,
      userId: req.params.userid,
      StartTime: req.body.startTime,
      EndTime: req.body.endTime,
      Model: car.Model,
      Manufacturer: car.Manufacturer,
      price,
    };
    car.IsAllocated = true;
    car.Allocatedto = req.params.userid;
    car.booked.push(booking);
    user.booked.push(booking);
    await user.save();
    await car.save();
    res.send({ booking, message: "Car is booked" });
  } catch (err) {
    if (err.name == "CastError") {
      return res.status(400).send({ message: "Car ID Not Valid" });
    }
    if (err.name == "MongoError") {
      return res.status(400).send({ message: "Car NumberPlate is not unique" });
    }
    if (err.name == "ValidationError") {
      return res.status(400).send({ message: "Car Update body is not valid" });
    }
    res.status(500).send({ message: "Internal server error" });
  }
});

CarRouter.delete("/end/:carid/", async (req, res) => {
  try {
    const car = await Vehicle.findById(req.params.carid);
    console.log(car);
    if (!car) {
      return res.status(400).send({ message: "Car not found by ID" });
    }
    car.IsAllocated = false;
    car.Allocatedto = null;
    await car.save();
    return res.status(200).send({ message: "Car freed" });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = CarRouter;
