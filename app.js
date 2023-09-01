const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

//Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
