const express = require("express");
const UserRouter = require("./routes/user");
const VehicleRouter = require("./routes/vehicle");
require("./db/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/user", UserRouter);
app.use("/car", VehicleRouter);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
