const Categories = require('../models/Categories');
const Groups = require('../models/Groups');

const multer = require('multer');
const shortid = require('shortid');

const multerConfiguration = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/groups/');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    })
}

const upload = multer(multerConfiguration).single('image');

exports.uploadImage = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            console.log(error);
        } else {
            next();
        }
    })
}

exports.newGroupForm = async (req, res) => {

    const categories = await Categories.findAll();

    res.render('new-group', {
        pageName: 'Create New Group',
        categories
    })
};

exports.newGroup = async (req, res, next) => {
    
    req.sanitizeBody('name');
    req.sanitizeBody('url');
    
    const group = req.body;

    
    group.userId = req.user.id;
    group.categoryId = req.body.category;

    // group.image = req.file.filename;
    
    try {
        await Groups.create(group);
        req.flash('exito', 'Group created successfully');
        res.redirect('/administration');
    } catch (error) {
        console.log(error);
        const sequelizeErrors = error.errors.map(err => err.message);
        req.flash('error', sequelizeErrors);
        res.redirect('/new-group');
    }
}