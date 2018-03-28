const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// passport config
require("./config/passport")(passport);

// Routes
const auth = require("./routes/auth");



const app = express();


app.get("/", (req, res) => {
  res.send("It works");
});




// use Routes
app.use("/auth", auth);




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
