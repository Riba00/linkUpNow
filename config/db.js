const Sequelize = require('sequelize');
require('dotenv').config({path: '.env'});

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    pool : {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // logging: false
});

