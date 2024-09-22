const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

const db = require('./config/db');
require('./models/Users')
require('./models/Categories')
require('./models/Groups')
require('./models/Events')
db.sync().then(()=> console.log('DB Connected')).catch((error)=>console.log(error))

require('dotenv').config({path: '.env'});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

// Routing
app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Server is running');
});