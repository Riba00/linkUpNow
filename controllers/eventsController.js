const Groups = require('../models/Groups')
const Events = require('../models/Events')

exports.newEventForm = async (req, res, next) => {
    const groups = await Groups.findAll({where: {userId : req.user.id}});    

    res.render('new-event', {
        pageName: 'Create New Event',
        groups
    })
}

exports.newEvent = async (req, res) => {
    const event = req.body;

    event.userId = req.user.id;

    const point = { type: 'POINT', coordinates: [ parseFloat(req.body.lat), parseFloat(req.body.lng)]};
    event.location = point;

    if (req.body.capacity == '') {
        event.capacity = 0;
    }

    try {
        await Events.create(event);
        req.flash('exito', 'Event Created Successfully');
        res.redirect('/administration');
    } catch (error) {
        console.log(error);        
        const sequelizeErrors = error.errors.map((err) => err.message);
        req.flash("error", sequelizeErrors);
        res.redirect('/new-event');
    }
}

exports.sanitizeEvent = (req, res, next) => {
    req.sanitizeBody('title').escape();
    req.sanitizeBody('guest').escape();
    req.sanitizeBody('capacity').escape();
    req.sanitizeBody('description').escape();
    req.sanitizeBody('date').escape();
    req.sanitizeBody('time').escape();
    req.sanitizeBody('capacity').escape();
    req.sanitizeBody('address').escape();
    req.sanitizeBody('city').escape();
    req.sanitizeBody('state').escape();
    req.sanitizeBody('country').escape();
    req.sanitizeBody('lat').escape();
    req.sanitizeBody('lng').escape();
    req.sanitizeBody('groupId').escape();

    next();
}