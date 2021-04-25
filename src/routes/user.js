const express = require("express");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");

const UserRouter = express.Router();

UserRouter.post("/create", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).send({ user, message: "User Created!" });
  } catch (err) {
    console.error(err);
    if (err.name == "ValidationError") {
      return res.status(400).send({ message: "User body is not valid" });
    }
    if (err.name == "MongoError") {
      return res
        .status(400)
        .send({ message: "Phone Number is alreasy used for other account" });
    }
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//add authentication
UserRouter.patch("/:id/", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { ...req.body });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User Updated", user });
  } catch (err) {
    if (err.name == "ValidationError") {
      console.log(err);
      return res.status(400).send({ message: "User Body Not Valid" });
    }
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

UserRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).send({ message: "Unable to delete" });
    }
    return res.status(200).send({ message: "User Deleted" });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

UserRouter.get("/bookings/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send({ message: "USer ID incorrect" });
    }
    return res.status(200).send({ bookings: user.booked });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = UserRouter;
