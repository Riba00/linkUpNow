const Sequelize = require('sequelize');
const db = require('../config/db');
const {v4: uuid} = require('uuid');
const Categories = require('./Categories')
const Users = require('./Users')

const Groups = db.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            }
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Description is required'
            }
        }
    },
    url: Sequelize.TEXT,
    image: Sequelize.TEXT
});

Groups.belongsTo(Categories);
Groups.belongsTo(Users);

module.exports = Groups;