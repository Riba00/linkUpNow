const Groups = require('../models/Groups');

exports.administrationPanel = async (req, res, next) => {
    const groups = await Groups.findAll({where: {userId : req.user.id}})

    res.render('administration', {
        pageName: 'Administration Panel',
        groups
    })
}