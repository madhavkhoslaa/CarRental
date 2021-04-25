const express = require("express");
const Vehicle = require("../models/vehicle");

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
  } catch (err) {}
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

CarRouter.post("/book/:id/:userid", async (req, res) => {
  try {
    //create a booking object
    //append booking object in user
    //append booking object in car
    //set allocated_to userid
    // see isallocated to true
    const car = await Vehicle.findById(req.params.id);
    const user = await User.findOne(req.params.userid);
    if (!car || !user) {
      return res.status(400).send({ message: "Car or user ID incorrect" });
    }
    const timefor = (req.body.endTime - req.body.startTime) / 60 / 60;
    const price = car.Baseprice + car.Ratehourly * timefor;
    const booking = {
      carId: req.params.id,
      userId: req.params.userid,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      Model: car.Model,
      Manufacturer: car.Manufacturer,
      price,
    };
    car.IsAllocated = true;
    car.Allocatedto = req.params.userid;
    car.booked.push({ booking });
    user.booked.push({ booking });
    Promise.all([user.save(), car.save]);
    res.send({ booking, message: "Car is booked" });
  } catch (err) {}
});

CarRouter.post("/end/:id/", async (req, res) => {
  try {
    const car = await Vehicle.findById(req.params.id);
    if (!car) {
      return res.status(400).send({ message: "Car not found by ID" });
    }
    car.IsAllocated = false;
    car.Allocatedto = null;
    await car.save();
    return res.status(200).send({ message: "Car freed" });
  } catch (err) {}
});

module.exports = CarRouter;
