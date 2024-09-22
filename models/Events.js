const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');

const Users = require('../models/Users');
const Groups = require('../models/Groups');


const Event = db.define(
    'event', {
        id  : {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false
        }, 
        title : {
            type : Sequelize.STRING,
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Title is required'
                }
            }
        }, 
        slug : {
            type: Sequelize.STRING,
        },
        guest : Sequelize.STRING,
        capacity : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        description : {
            type : Sequelize.TEXT, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Description is required'
                }
            }
        },
        date : {
            type : Sequelize.DATEONLY, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Date is required'
                }
            }
        },
        hour : {
            type : Sequelize.TIME, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Hour is required'
                }
            }
        },
        address : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Address is required'
                }
            }
        },
        city : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'City is required'
                }
            }
        },
        state : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'State is required'
                }
            }
        },
        country : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Country is required'
                }
            }
        },
        location : {
            type : Sequelize.GEOMETRY('POINT') 
        },
        interested : {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue : []
        }
    }, {
        hooks: {
            async beforeCreate(event) {
                const url = slug(event.title).toLowerCase();
                event.slug = `${url}-${shortid.generate()}`;
            }
        }
    } );

Event.belongsTo(Users);
Event.belongsTo(Groups);

module.exports = Event;