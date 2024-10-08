const Users = require('../models/Users');
const sendEmail = require('../handlers/emails')

exports.singUpForm = (req, res, next) => {
    res.render('sign-up', {
        pageName: 'Sign Up'
    })
};

exports.createNewUser = async (req, res) => {
    const user = req.body;
        
    req.checkBody('passwordConfirm', 'Confirm Password is required').notEmpty();
    req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);

    const expressErrors = req.validationErrors();

    try {
        await Users.create(user);

        const url = `http://${req.headers.host}/confirm-account/${user.email}`;

        await sendEmail.sendEmail({
            user,
            url,
            subject: 'Confirm your account in LinkUpNow',
            file: 'confirm-account'
        })

        req.flash('exito', 'Check you email and confirm you account');
        res.redirect('/signIn');
    } catch (error) {
        console.log(error);
        
        const sequelizeErrors = error.errors ? error.errors.map(err => err.message) : [];
        const expressErr = expressErrors ? expressErrors.map(err => err.msg) : [];


        const errorList = [...sequelizeErrors, ...expressErr]
        
        req.flash('error', errorList);
        res.redirect('/signUp');
    }   
}

exports.singInForm = (req, res, next) => {
    res.render('sign-in', {
        pageName: 'Sign In'
    })
};

exports.confirmAccount = async (req, res, next) => {
    const user = await Users.findOne({where: {email: req.params.email}});

    if (!user) {
        req.flash('error', 'User not found');
        res.redirect('/signUp');
        return next();
    }

    user.isActive = 1;
    await user.save();

    req.flash('exito', 'Account confirmed, you can sing in');
    res.redirect('/signIn');
}

exports.editProfileForm = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);

    res.render('edit-profile', {
        pageName: 'Edit Profile',
        user
    })
}

exports.editProfile = async (req, res) => {
    const user = await Users.findByPk(req.user.id);

    req.sanitizeBody('name');
    req.sanitizeBody('email');

    const { name, description, email} = req.body;
    
    user.name = name;
    user.description = description;
    user.email = email;

    await user.save();

    req.flash('exito', 'User Updated Successfully');
    res.redirect('/administration');
}

exports.changePasswordForm = (req, res) => {
    res.render('change-password', {
        pageName: `Change Password`
    })
}

exports.changePassword = async (req, res, next) => {

    const user = await Users.findByPk(req.user.id);

    if (!user.validatePassword(req.body.currentPassword)) {
        req.flash('error', 'Current Password is not correct');
        res.redirect('/administration');
        return next();
    }

    const hash = user.hashPassword(req.body.newPassword);

    user.password = hash;

    await user.save();

    req.logout(req.user, (err) => {
        if (err) return next(err);
        req.flash(
          "exito",
          "Password Updated. Please, sing in"
        );
        res.redirect("/signIn");
    })
}