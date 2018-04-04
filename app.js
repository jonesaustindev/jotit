const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const passport = require("passport");
const methodOverride = require('method-override');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// store mlab credentials
// dotenv.config();

// models
require('./models/User');
require('./models/Story');

// passport config
require("./config/passport")(passport);

///// Routes //////
const auth = require("./routes/auth");
const index = require("./routes/index");
const stories = require('./routes/stories');

// adding keys
const keys = require("./config/keys");

// handlebars helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// mongoose promise
mongoose.Promise = global.Promise;
// connect mongoose
mongoose.connect(keys.mongoURI)
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));


const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
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

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// caching disabled for every route
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});



// use Routes //
app.use("/auth", auth);
app.use("/", index);
app.use('/stories', stories);




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
