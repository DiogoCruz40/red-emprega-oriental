const db = require("../models");
var cron = require('node-cron');
var moment = require('moment-timezone');
var bcrypt = require("bcryptjs");

const Newsletter = db.newsletter;
const Email = db.email;
const OfertaEmprego = db.ofertaEmprego;
const OfertaFormacao = db.ofertaFormacao;
const Noticia = db.noticia;
const emailManager = require("../middlewares/emailManager");
const newemail = require("../models/newsletter");
const config = require('../config/config');

exports.submitemail = (req, res) => {

    Newsletter.findOne({ email: req.body.email }, {
    }, (err, newletter) => {
        if (newletter) {

            if (newletter.arquivado == false) {
                return res.status(400).json('Este email já se encontra registado.');
            }
            else {
                Newsletter.findByIdAndUpdate(newletter._id, { arquivado: false }, { new: true }, (err, data) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    return res.json("Email desarquivado com sucesso do newsletter.");

                });
            }
        }
        else {
            const newNewLetter = new Newsletter({
                email: req.body.email
            })
            newNewLetter.save((err, newsletter) => {
                if (err) {
                    return res.status(500).json(err);

                }
                return res.json("Email adicionado com sucesso ao newsletter.");

            });
        }
    });

};

exports.submitunsubscribe = (req, res) => {

    Newsletter.find({ arquivado: false }, {}, (err, newletter) => {
        if (Object.keys(newletter).length != 0) {
            for (newsletterAux of newletter) {
                if (bcrypt.compareSync(newsletterAux.email, req.body.hash)) {

                    Newsletter.findByIdAndUpdate(newsletterAux._id, { arquivado: true }, { new: true }, (err, data) => {
                        if (err) {
                            return res.status(500).json(err);
                        }
                        else {
                            return res.json("Email arquivado com sucesso do newsletter.");
                        }
                    });
                }
                else {
                    return res.status(400).json('Algo correu mal.');
                }
            }
        }
        else {
            return res.status(400).json('Algo correu mal.');
        }
    });
};

cron.schedule('0 0 9 * * 1', () => {

    var messagehtml = ``;
    var contador = 0;

    var ofertaempregoo = new Promise((resolve, reject) => {
        OfertaEmprego.find({ newsletter: false, arquivado: false,dataLimite:{$gte: moment(new Date(), 'UTC').utcOffset(0, true).startOf('day').toDate()} }, {
        }, (err, ofertas) => {
            if (Object.keys(ofertas).length != 0) {
                contador++;
                messagehtml = `<h2>As Novas Ofertas de Emprego:</h2>`;
                ofertas.forEach(oferta => {
                    oferta.observacoes = oferta.observacoes.replace(/\n/g, "<br />");
                    messagehtml = messagehtml + `
            <h3>Oferta ${oferta.nome}</h3>
            <ul>  
                <li>Função: ${oferta.funcao}</li>
                <li>Contacto: ${oferta.contacto}</li>
                <li>Email: ${oferta.email}</li>
                <li>Data Limite: ${moment.tz(oferta.dataLimite, 'UTC').tz('Europe/Lisbon').format('DD-MM-YYYY')}</li>
                <li>Local: ${oferta.local}</li>
            </ul>
            <h4>Observações:</h4>
            <p>${oferta.observacoes ? oferta.observacoes : 'Sem Observações.'}</p>
            <hr>`

                    OfertaEmprego.findByIdAndUpdate(oferta.id, { "newsletter": true }, (err, data) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                    });

                });
                messagehtml = messagehtml + `<hr>`;
            }
            resolve(messagehtml);
        });
    });

    ofertaempregoo.then(messagehtml => {

        var ofertaFormacaoo = new Promise((resolve, reject) => {
            OfertaFormacao.find({ newsletter: false, arquivado: false,dataLimite:{$gte: moment(new Date(), 'UTC').utcOffset(0, true).startOf('day').toDate()} }, {
            }, (err, ofertas) => {

                if (Object.keys(ofertas).length != 0) {
                    messagehtml = messagehtml + `<h2>As Novas Ofertas de Formação:</h2>`;
                    contador++;
                    ofertas.forEach(oferta => {
                        oferta.observacoes = oferta.observacoes.replace(/\n/g, "<br />");
                        messagehtml = messagehtml + `
            <h3>Oferta ${oferta.nome}</h3>
            <ul>  
             
                <li>Função: ${oferta.areaFormacao}</li>
                <li>Contacto: ${oferta.contacto}</li>
                <li>Email: ${oferta.email}</li>
                <li>Data Limite: ${moment.tz(oferta.dataLimite, 'UTC').tz('Europe/Lisbon').format('DD-MM-YYYY')}</li>
                <li>Local: ${oferta.local}</li>
            </ul>
            <h4>Observações:</h4>
            <p>${oferta.observacoes ? oferta.observacoes : 'Sem Observações.'}</p>
            <hr>`;

                        OfertaFormacao.findByIdAndUpdate(oferta.id, { "newsletter": true }, (err, data) => {
                            if (err) {
                                console.log(err)
                                return;
                            }
                        });

                    });
                    messagehtml = messagehtml + `<hr>`;
                }

                resolve(messagehtml);
            });
        });
        ofertaFormacaoo.then(messagehtml => {
            var noticiasHtml = new Promise((resolve, reject) => {
                Noticia.find({ newsletter: false, arquivado: false }, {
                }, (err, noticias) => {
                    if (Object.keys(noticias).length != 0) {
                        messagehtml = messagehtml + `<h2>As Novas Notícias:</h2>`;
                        contador++;
                        noticias.forEach(noticia => {
                            noticia.descricao = noticia.descricao.replace(/\n/g, "<br />");
                            messagehtml = messagehtml + `
            <h3>${noticia.titulo}</h3>
            <p>${noticia.descricao ? noticia.descricao : ''}</p>
            <p>Data: ${moment.tz(noticia.dataInsercao, 'UTC').tz('Europe/Lisbon').format('DD-MM-YYYY')}
            <hr>`;

                            Noticia.findByIdAndUpdate(noticia.id, { "newsletter": true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                    return;
                                }
                            });

                        });
                        messagehtml = messagehtml + `<hr>`;
                    }

                    resolve(messagehtml);
                });
            })
            noticiasHtml.then(messagehtml => {
                if (contador != 0) {
                    Newsletter.find({ arquivado: false }, {}, (err, users) => {
                        if (Object.keys(users).length != 0) {

                            users.forEach(user => {

                                hashemail = bcrypt.hashSync(user.email, 8)

                                messagetosend = messagehtml + `<br>Recebeste este e-mail porque subscreveste a newsletter da Workipédia. Caso queiras cancelar a tua subscrição <a target="_blank" href="${config.DOMAIN}/unsubscribe?hash=${hashemail}">clica aqui.</a>`

                                var mailOptions = {
                                    from: 'geral@workipedia.pt',
                                    to: user.email,
                                    subject: `As Novas Ofertas desta semana`,
                                    html: messagetosend,
                                    attachments: {}
                                };

                                const email = new Email({
                                    assunto: mailOptions.subject,
                                    mensagem: mailOptions.html,
                                    to: mailOptions.to,
                                    anexo: mailOptions.attachments,
                                    sended: false
                                });

                                email.save((err) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    emailManager.placeEmail(email)
                                        .catch((err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                });

                            });
                        }
                    });

                }
            }).catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
        }).catch((err) => {
            if (err) {
                console.log(err);
            };
        });
    }).catch((err) => {
        if (err) {
            console.log(err);
        }
    });
}, {
    scheduled: true,
    timezone: "Europe/Lisbon"
}).start();