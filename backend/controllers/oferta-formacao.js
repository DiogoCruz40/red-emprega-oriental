const config = require("../config/auth");
const db = require("../models");
const OfertaFormacao = db.ofertaFormacao;
const User = db.user;
const Email = db.email;
const File = db.file;
const emailManager = require("../middlewares/emailManager");
const { ofertaFormacao } = require("../models");
var moment = require('moment-timezone');
const fs = require("fs");
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

function checkMail(str) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(str);
}

//TODO: eliminar campos desnecessários
exports.getOfertasFormacaoPublic = (req, res) => {

    ofertaFormacao.aggregate([
        {
            $lookup: {
                from: "administradors",
                localField: "inseridoPor",
                foreignField: "_id",
                as: "inseridoPor"
            },
        },
        { $sort: { 'dataInsercao': -1 } },
        {
            $unwind: '$inseridoPor',
        },
        {
            $lookup: {
                from: "files",
                localField: "anexos",
                foreignField: "_id",
                as: "anexos"
            }
        },
        {
            $match: {
                arquivado: false,
                'dataLimite': { $gte: moment(new Date(), 'UTC').utcOffset(0, true).startOf('day').toDate() }
            }
        },
        {
            $project: {
                "inseridoPor.email": 0,
                "inseridoPor.date": 0,
                "inseridoPor.password": 0,
                "inseridoPor.resetpassword": 0,
                "inseridoPor.sent": 0,
                "inseridoPor._id": 0,
                "inseridoPor.omnipotente": 0,
                "arquivado": 0,
                "newsletter": 0,
                "email": 0
            }
        }
    ], (err, users) => {
        return res.status(200).json(users);
    }
    );

};

exports.getOfertasFormacao = (req, res) => {

    ofertaFormacao.aggregate([
        {
            $lookup: {
                from: "administradors",
                localField: "inseridoPor",
                foreignField: "_id",
                as: "inseridoPor"
            },
        },
        { $sort: { 'dataInsercao': -1 } },
        {
            $lookup: {
                from: "files",
                localField: "anexos",
                foreignField: "_id",
                as: "anexos"
            }
        },
        {
            $unwind: '$inseridoPor',
        },
        {
            $match: {
                arquivado: false,
                'dataLimite': { $gte: moment(new Date(), 'UTC').utcOffset(0, true).startOf('day').toDate() }
            }
        },
        {
            $project: {
                "inseridoPor.email": 0,
                "inseridoPor.date": 0,
                "inseridoPor.password": 0,
                "inseridoPor.resetpassword": 0,
                "inseridoPor.sent": 0,
                "inseridoPor._id": 0,
                "inseridoPor.omnipotente": 0,
                "arquivado": 0,
                "newsletter": 0,
            }
        }

    ], (err, users) => {
        return res.status(200).json(users);
    }
    );

};

exports.getOfertasFormacaoExpirado = (req, res) => {

    ofertaFormacao.aggregate([
        {
            $lookup: {
                from: "administradors",
                localField: "inseridoPor",
                foreignField: "_id",
                as: "inseridoPor"
            },
        },
        {
            $lookup: {
                from: "files",
                localField: "anexos",
                foreignField: "_id",
                as: "anexos"
            }
        },
        { $sort: { 'dataInsercao': -1 } },
        {
            $unwind: '$inseridoPor',
        },
        {
            $match: {
                arquivado: false,
                dataLimite: { $lt: moment(new Date(), 'UTC').subtract(1, 'days').utcOffset(0, true).endOf('day').toDate() }
            }
        },
        {
            $project: {
                "inseridoPor.email": 0,
                "inseridoPor.date": 0,
                "inseridoPor.password": 0,
                "inseridoPor.resetpassword": 0,
                "inseridoPor.sent": 0,
                "inseridoPor._id": 0,
                "arquivado": 0,
                "newsletter": 0,
            }
        }

    ], (err, users) => {
        return res.status(200).json(users);
    });

};

exports.getOfertasFormacaoArquivado = (req, res) => {

    ofertaFormacao.aggregate([
        {
            $lookup: {
                from: "administradors",
                localField: "inseridoPor",
                foreignField: "_id",
                as: "inseridoPor"
            },
        },
        {
            $unwind: '$inseridoPor',
        },
        { $sort: { 'dataInsercao': -1 } },
        {
            $lookup: {
                from: "files",
                localField: "anexos",
                foreignField: "_id",
                as: "anexos"
            }
        },
        {
            $match: {
                arquivado: true,
            }
        },
        {
            $project: {
                "inseridoPor.email": 0,
                "inseridoPor.date": 0,
                "inseridoPor.password": 0,
                "inseridoPor.resetpassword": 0,
                "inseridoPor.sent": 0,
                "inseridoPor._id": 0,
                "arquivado": 0,
                "newsletter": 0,
            }
        }

    ], (err, users) => {
        return res.status(200).json(users);
    });

};

exports.addOfertaFormacao = (req, res) => {

    if (req.body.emailsAEnviar) {
        req.body.emailsAEnviar = req.body.emailsAEnviar.split(',');
        for (let email of req.body.emailsAEnviar) {
            if (!checkMail(email)) {
                res.status(400).json("Existe emails inválidos no campo 'Emails a enviar candidaturas'. Ex: exemplo@exemplo.pt");
                return;
            }
        }
    }
    User.findById(req.userId).exec(async (err, user) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        var ficheirosList = [];
        async function saveFiles() {
            for (let file of req.files) {
                var ficheiroSync = fs.readFileSync(file.path);

                const newFile = new File({
                    type: file.mimetype,
                    data: ficheiroSync,
                    fileName: file.originalname
                })

                await newFile.save().then(fileSaved => {
                    ficheirosList.push(fileSaved._id);
                });
                await unlinkAsync(file.path);
            }
            return;
        }
        if (req.files)
            await saveFiles();
        const ofertaFormacao = new OfertaFormacao({
            nome: req.body.nome,
            areaFormacao: req.body.areaFormacao,
            contacto: req.body.contacto,
            email: req.body.email,
            horario: req.body.horario,
            dataLimite: moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
            local: req.body.local,
            observacoes: req.body.observacoes ? req.body.observacoes : '',
            dataInsercao: moment(new Date(), 'UTC').utcOffset(0, true).toDate(),
            inseridoPor: user._id,
            emailsAEnviar: req.body.emailsAEnviar,
            anexos: ficheirosList
        });

        ofertaFormacao.save((err, oferta) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    console.error('Erro nas validações!', err);
                    res.status(422).json(err);
                    return;
                }
                else {
                    res.status(400).json(err);
                    return;
                }
            }
            res.json("Oferta de Formação adicionada com sucesso.");

        });

    });
}

exports.updateOfertaFormacao = async (req, res) => {

    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {

        if (req.body.emailsAEnviar) {
            req.body.emailsAEnviar = req.body.emailsAEnviar.split(',');
            for (let email of req.body.emailsAEnviar) {
                if (!checkMail(email)) {
                    res.status(400).json("Existe emails inválidos no campo 'Emails a enviar candidaturas'. Ex: exemplo@exemplo.pt");
                    return;
                }
            }
        }

        var ficheirosList = [];
        async function saveFiles() {
            for (let file of req.files) {
                var ficheiroSync = fs.readFileSync(file.path);

                const newFile = new File({
                    type: file.mimetype,
                    data: ficheiroSync,
                    fileName: file.originalname
                })

                await newFile.save().then(fileSaved => {
                    ficheirosList.push(fileSaved._id);
                });
                await unlinkAsync(file.path);
            }
            return;
        }
        if (req.files)
            await saveFiles();

        async function eliminaFicheirosAntigos() {
            OfertaFormacao.findOne({ _id: req.body._id }, (errOferta, oferta) => {
                if (errOferta) {
                    res.status(500).json(err);
                    return;
                }
                File.remove({ _id: { $in: oferta.anexos } }, (errDocs, docs) => {
                    if (errDocs) {
                        res.status(500).json(err);
                        return;
                    }
                })

            });
        }
        await eliminaFicheirosAntigos();
        ofertaFormacao.findByIdAndUpdate(req.body._id, {
            "nome": req.body.nome, "areaFormacao": req.body.areaFormacao, "contacto": req.body.contacto,
            "email": req.body.email, "horario": req.body.horario, "dataLimite": moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
            "local": req.body.local, "observacoes": req.body.observacoes ? req.body.observacoes : '', "arquivado": false, "emailsAEnviar": req.body.emailsAEnviar, "anexos": ficheirosList
        }, (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json("Oferta de formação atualizada com sucesso.");
        });
    }
}
exports.renovaOfertaFormacao = (req, res) => {
    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }

    else {
        let dataAtual = moment(new Date(), 'UTC').utcOffset(0, true).toDate();
        let dataLimite = moment(req.body.dataLimite, 'DD-MM-YYYY').add(1, 'days').utcOffset(0, true).endOf('day').toDate();
        if (Date.parse(dataAtual) > Date.parse(dataLimite)) {
            res.status(400).json("Data limite não é válida.");
        }

        else {
            OfertaFormacao.findByIdAndUpdate(req.body._id, {
                "dataLimite":
                    moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
            }, (err, data) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                res.status(200).json("Oferta de formação renovada com sucesso.");
            });
        }

    }
}

exports.desarquivaOfertaFormacao = (req, res) => {
    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        let dataAtual = moment(new Date(), 'UTC').utcOffset(0, true).toDate();
        let dataLimite = moment(req.body.dataLimite, 'DD-MM-YYYY').add(1, 'days').utcOffset(0, true).endOf('day').toDate();
        if (Date.parse(dataAtual) > Date.parse(dataLimite)) {
            res.status(400).json("Data limite não é válida.");
        }

        else {
            OfertaFormacao.findByIdAndUpdate(req.body._id, {
                "dataLimite": moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
                "arquivado": false
            }
                , (err, data) => {
                    if (err) {
                        res.status(500).json(err);
                        return;
                    }
                    res.json("Oferta de formação desarquivada com sucesso.");
                });
        }

    }
}

exports.deleteOfertaFormacao = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        OfertaFormacao.findByIdAndUpdate(req.query.id, { "arquivado": true }, (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json("Oferta de formação arquivada com sucesso.");
        });
    }
};

exports.deleteOfertaFormacaoHard = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        OfertaFormacao.findOneAndDelete({ _id: req.query.id }, (errOferta, oferta) => {
            if (errOferta) {
                res.status(500).json(err);
                return;
            }
            File.remove({ _id: { $in: oferta.anexos } }, (errDocs, docs) => {
                if (errDocs) {
                    res.status(500).json(err);
                    return;
                }
                res.json("Oferta de formação eliminada permanentemente com sucesso.");
            })
        });
    }
};


exports.candidaturaOfertaFormacao = (req, res) => {
    var ofertaFormacao = new Promise((resolve, reject) => {
        OfertaFormacao.findOne({ _id: req.body.idOferta, arquivado: false, dataLimite: { $gte: Date.now() - 86400000 } }, (err, oferta) => {
            resolve(oferta);
        });
    });

    ofertaFormacao.then(async oferta => {

        oferta.numCandidaturas++;
        await oferta.save((err, oferta) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    console.error('Erro nas validações!', err);
                    res.status(422).json(err);
                    return;
                }
                else {
                    res.status(400).json(err);
                    return;
                }
            }
        });

        var mailOptions = {
            from: 'geral@workipedia.pt',
            to: oferta.emailsAEnviar,
            subject: 'Foi realizado uma nova candidatura relativa à oferta de formação: ' + oferta.nome,
            html: `
        <h2>Detalhes da Oferta de Formação:</h2>
        <ul>  
          <li>Nome: ${oferta.nome}</li>
          <li>Função: ${oferta.areaFormacao}</li>
          <li>Contacto: ${oferta.contacto}</li>
          <li>Email: ${oferta.email}</li>
          <li>Data Limite: ${moment.tz(oferta.dataLimite, 'UTC').tz('Europe/Lisbon').format('DD-MM-YYYY')}</li>
          <li>Local: ${oferta.local}</li>
        </ul>
        <h3>Observações:</h3>
        <p>${oferta.observacoes ? oferta.observacoes : 'Sem Observações.'}</p>

        <h2>Detalhes da candidatura realizada:</h2>
        <ul>
          <li>Nome: ${req.body.nome}</li>
          <li>Assunto: ${req.body.telemovel}</li>
          <li>Email: ${req.body.email}</li>
          <li>Data de realização: ${moment.tz(new Date(), 'UTC').tz('Europe/Lisbon').format('DD-MM-YYYY HH:mm')}</li>
        </ul>
        <h3>Observações:</h3>
        <p>${req.body.observacoes ? req.body.observacoes : 'Sem Observações.'}</p>
    `,
            attachments: {}
        };

        if (req.file) {
            mailOptions.attachments = {
                filename: req.file.originalname,
                path: req.file.path
            }
        }

        const email = new Email({
            assunto: mailOptions.subject,
            mensagem: mailOptions.html,
            to: mailOptions.to,
            anexo: mailOptions.attachments,
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
};