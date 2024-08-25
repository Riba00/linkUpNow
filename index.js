const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const router = require('./routes');

require('dotenv').config({path: '.env'});

const app = express();

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'))

app.use(express.static('public'));

app.use((req, res, next) => {
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

// Routing
app.use('/', router());




app.listen(process.env.PORT, () => {
    console.log('Server is running');
});