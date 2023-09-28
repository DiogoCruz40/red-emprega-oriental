var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    port: '465',
    auth: {
        user: 'geral@workipedia.pt',
        pass: 'AvV#mB~W$+rX'
    },
    name: 'Geral',
    host: 'webdomain02.dnscpanel.com'
});

module.exports = transporter;