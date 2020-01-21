const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
//const passport = require('passport');
//const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();


// DB config
const db = require('./config/dbconnect').MongoURI;


// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Middleware EJs view
app.use(expressLayouts);
app.set('view engine', 'ejs');

//handling put and delet routes
app.use(methodOverride('_method'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static('public'));

//flash
app.use(require('connect-flash')());
app.use(session({
    secret: 'Free Stevy',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());
//app.use(passport.initialize());
//app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error_tries = req.flash('error_tries');
    next();
});








//importing routes
app.use('/', require('./routes/guiroutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));