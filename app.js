const express = require("express");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const session = require('express-session');

// store mlab credentials
dotenv.config();

// models
require('./models/User');

// passport config
require("./config/passport")(passport);

///// Routes //////
const auth = require("./routes/auth");
const index = require("./routes/index");

// adding keys
const keys = require("./config/keys");

// mongoose promise
mongoose.Promise = global.Promise;
// connect mongoose
mongoose.connect(keys.mongoURI)
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));


const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});





// use Routes //
app.use("/auth", auth);
app.use("/", index);




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
