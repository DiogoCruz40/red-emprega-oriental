const config = require("../config/auth");
const db = require("../models");
const Email = db.email;
const User = db.user;
const emailManager = require("../middlewares/emailManager");
var request = require('request');

exports.submitContacto = (req, res) => {



    var utilizadores = new Promise((resolve, reject) => {
        User.find({ omnipotente: true }, {
            _id: 0,
            email: 1
        }, (err, users) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            resolve(users);
        });
    });

    utilizadores.then(utilizadores => {
        const mailList = [];
        for (utilizador of utilizadores) {
            mailList.push(utilizador.email);
        }
        req.body.mensagem = req.body.mensagem.replace(/\n/g, "<br />");

        var mailOptions = {
            from: 'geral@workipedia.pt',
            to: mailList,
            subject: 'Foi feito um novo contacto na workipedia.pt',
            html: `
        <h2>Foi feito um novo contacto na workipedia.pt</h2>
        <h3>Detalhes do contacto:</h3>
        <ul>  
          <li>Nome: ${req.body.nome}</li>
          <li>Assunto: ${req.body.assunto}</li>
          <li>Email: ${req.body.email}</li>
        
        </ul>
        <h3>Mensagem:</h3>
        <span>${req.body.mensagem}</span>
    `
        };

        const email = new Email({
            assunto: mailOptions.subject,
            mensagem: mailOptions.html,
            to: mailOptions.to,
            sended: false
        });

        email.save((err) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            emailManager.placeEmail(email)
                .then((job) => res.json({
                    done: true,
                    order: job.id,
                    message: "Mensagem adicionada com sucesso."
                }))
                .catch((err) => {
                    if (err) {
                        res.status(400).json(err);
                    }
                });
        });
    });
}

exports.captchaValidator = (req, res) => {


    const secret_key = "6LcIv4QcAAAAADL_8Joft9Cu_gnzdyj4l3bE_X0T";

    request(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.response}`, function (error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.status(400).json("Problemas ao validar o captcha.");
        }
        return res.status(200).json();
    });
}