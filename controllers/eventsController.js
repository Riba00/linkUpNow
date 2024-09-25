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

exports.editEventForm = async (req, res, next) => {

    const querys = [];

    querys.push( Groups.findAll({ where: { userId: req.user.id}}));
    querys.push( Events.findByPk(req.params.id));

    const [ groups, event ] = await Promise.all(querys);

    if (!groups || !event) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/administration');
        return next();
    }

    res.render('edit-event', {
        pageName: `Edit Event : ${event.title}`,
        groups,
        event
    })
}

exports.editEvent = async (req, res, next) => {

    const event = await Events.findOne({where : {id: req.params.id, userId: req.user.id}});

    if (!event) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/administration');
        return next();
    }
    
    const { groupId, title, guest, date, hour, capacity, description, address, city, state, country, lat, lng } = req.body

    event.groupId = groupId;
    event.title = title;
    event.guest = guest;
    event.date = date;
    event.hour = hour;
    event.capacity = capacity;
    event.description = description;
    event.address = address;
    event.city = city;
    event.state = state;
    event.country = country;

    const point = {type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)]};

    event.location = point;

    await event.save();

    req.flash('exito', 'Event Updated Successfully');
    res.redirect('/administration');
}

exports.deleteEventForm = async (req, res, next) => {
    const event = await Events.findOne({where: {id: req.params.id, userId: req.user.id}});

    if (!event) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/administration');
        return next();
    }

    res.render('delete-event', {
        pageName: `Delete Event : ${event.title}`
    })
}

exports.deleteEvent = async (req, res, next) => {
    await Events.destroy({
        where: {
            id: req.params.id
        }
    });

    req.flash('exito', 'Event Deleted Successfully');
    res.redirect('/administration');
}

