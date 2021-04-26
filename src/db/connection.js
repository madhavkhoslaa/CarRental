const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGOURL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
    console.log("Unable to connect to DB");
  });
