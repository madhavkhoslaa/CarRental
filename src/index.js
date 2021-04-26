const express = require("express");
require("./db/connection");
const UserRouter = require("./routes/user");
const VehicleRouter = require("./routes/vehicle");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/user", UserRouter);
app.use("/car", VehicleRouter);

app.get("/", async (req, res) => {
  res.send({ message: "Welcone to RentACarr API" });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
