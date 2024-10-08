const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    }
})

exports.sendEmail = async (options) => {
    const file = __dirname + `/../views/emails/${options.file}.ejs`;

    const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));

    const html = compiled({url : options.url});

    const emailOptions = {
        from: 'LinkUpNow <noreply@linkupnow.com>',
        to: options.user.email,
        subject: options.subject,
        html
    };

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, emailOptions);
};