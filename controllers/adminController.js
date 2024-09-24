const Groups = require('../models/Groups');
const Events = require('../models/Events');

const moment = require('moment');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.administrationPanel = async (req, res, next) => {

    const querys = [];
    querys.push(Groups.findAll({where: {userId : req.user.id}}));
    querys.push(Events.findAll({where: {userId : req.user.id, date: {[Op.gte]: moment(new Date()).format('YYYY-MM-DD')}}}));
    querys.push(Events.findAll({where: {userId : req.user.id, date: {[Op.lt]: moment(new Date()).format('YYYY-MM-DD')}}}));

    const [ groups, events, previous ] = await Promise.all(querys);

    res.render('administration', {
        pageName: 'Administration Panel',
        groups,
        events,
        previous,
        moment
    });
}