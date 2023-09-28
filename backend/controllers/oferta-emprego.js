var cron = require('node-cron');
const db = require("../models");
const OfertaEmprego = db.ofertaEmprego;
const User = db.user;
const Email = db.email;
const File = db.file;

const emailManager = require("../middlewares/emailManager");
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment-timezone');
const fs = require("fs");

const ofertaEmprego = require("../models/oferta-emprego");
const { file } = require('../models');
const { promisify } = require('util');
const files = require('../models/files');

const unlinkAsync = promisify(fs.unlink);

exports.getOfertasEmpregoPublic = (req, res) => {


    ofertaEmprego.aggregate([
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
                "anexos.data": 0,
                "anexos.type": 0,
                "email": 0
            }
        }
    ], (err, users) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(200).json(users);
    }
    );

};


exports.getOfertasEmprego = (req, res) => {
    ofertaEmprego.aggregate([
        {
            $lookup: {
                from: 'administradors',
                localField: 'inseridoPor',
                foreignField: '_id',
                as: 'inseridoPor'
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
                "anexos.data": 0,
                "anexos.type": 0
            }
        }

    ], (err, users) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(200).json(users);
    }
    );

};

exports.getOfertasEmpregoExpirado = (req, res) => {
    ofertaEmprego.aggregate([
        {
            $lookup: {
                from: 'administradors',
                localField: 'inseridoPor',
                foreignField: '_id',
                as: 'inseridoPor'
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
                arquivado: false, dataLimite: { $lt: moment(new Date(), 'UTC').subtract(1, 'days').utcOffset(0, true).endOf('day').toDate() }
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
        }], (err, users) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            return res.status(200).json(users);
        });

};

exports.getOfertasEmpregoArquivado = (req, res) => {

    ofertaEmprego.aggregate([
        {
            $lookup: {
                from: 'administradors',
                localField: 'inseridoPor',
                foreignField: '_id',
                as: 'inseridoPor'
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
                "inseridoPor.omnipotente": 0,
                "arquivado": 0,
                "newsletter": 0,
            }
        }], (err, users) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            return res.status(200).json(users);
        });

};

exports.addOfertaEmprego = (req, res) => {
    User.findById(req.userId).exec(async (err, user) => {
        if (err) {
            res.status(400).json(err);
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
        const ofertaEmprego = new OfertaEmprego({
            nome: req.body.nome,
            funcao: req.body.funcao,
            contacto: req.body.contacto,
            email: req.body.email,
            horario: req.body.horario,
            curriculo: req.body.curriculo,
            remuneracao: req.body.remuneracao,
            beneficios: req.body.beneficios,
            dataLimite: moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
            local: req.body.local,
            outrasRegalias: req.body.outrasRegalias,
            perfilExperienciaProfissional: req.body.perfilExperienciaProfissional,
            observacoes: req.body.observacoes ? req.body.observacoes : '',
            dataInsercao: moment(new Date(), 'UTC').utcOffset(0, true).toDate(),
            inseridoPor: ObjectId(user._id),
            anexos: ficheirosList
        });
        ofertaEmprego.save((err, oferta) => {
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
            res.json("Oferta de Emprego adicionada com sucesso.");

        });


    });
}

exports.updateOfertaEmprego = async (req, res) => {

    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')

    }
    else {

        ficheirosList = [];
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
            OfertaEmprego.findOne({ _id: req.body._id }, (errOferta, oferta) => {
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
        OfertaEmprego.findByIdAndUpdate(req.body._id, {
            "nome": req.body.nome, "funcao": req.body.funcao, "contacto": req.body.contacto,
            "email": req.body.email, "horario": req.body.horario, "curriculo": req.body.curriculo,
            "remuneracao": req.body.remuneracao, "dataLimite": moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(), "local": req.body.local,
            "outrasRegalias": req.body.outrasRegalias, "perfilExperienciaProfissional": req.body.perfilExperienciaProfissional,
            "observacoes": req.body.observacoes, "arquivado": false, "anexos": ficheirosList
        }, (err, data) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json("Oferta de emprego atualizada com sucesso.");
        });
    }
}
exports.renovarOfertaEmprego = (req, res) => {
    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')

    }

    else {

        let dataAtual = moment(new Date(), 'DD-MM-YYYY').utcOffset(0, true).toDate();
        let dataLimite = moment(req.body.dataLimite, 'DD-MM-YYYY').add(1, 'days').utcOffset(0, true).endOf('day').toDate();
        if (Date.parse(dataAtual) > Date.parse(dataLimite)) {
            res.status(400).json('Data limite não é válida.');
        }
        else {
            OfertaEmprego.findByIdAndUpdate(req.body._id, {
                "dataLimite": moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
            }, (err, data) => {
                if (err) {
                    res.status(503).json(err);
                    return;
                }
                res.json("Oferta de emprego renovada com sucesso.");
            });
        }

    }
}

exports.desarquivarOfertaEmprego = (req, res) => {
    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        let dataAtual = moment(new Date(), 'DD-MM-YYYY').utcOffset(0, true).toDate();
        let dataLimite = moment(req.body.dataLimite, 'DD-MM-YYYY').add(1, 'days').utcOffset(0, true).endOf('day').toDate();
        if (Date.parse(dataAtual) > Date.parse(dataLimite)) {
            res.status(400).json('Data limite não é válida.');
        }
        else {
            OfertaEmprego.findByIdAndUpdate(req.body._id, {
                "dataLimite": moment(req.body.dataLimite, 'DD-MM-YYYY').utcOffset(0, true).toDate(),
                "arquivado": false
            }, (err, data) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                res.json("Oferta de emprego desarquivada com sucesso.");
            });
        }

    }
}

exports.deleteOfertaEmprego = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        OfertaEmprego.findByIdAndUpdate(req.query.id, { "arquivado": true }, (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json("Oferta de emprego arquivada com sucesso.");
        });
    }
};

exports.deleteOfertaEmpregoHard = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        OfertaEmprego.findOneAndDelete({ _id: req.query.id }, (errOferta, oferta) => {
            if (errOferta) {
                res.status(500).json(err);
                return;
            }
            File.remove({ _id: { $in: oferta.anexos } }, (errDocs, docs) => {
                if (errDocs) {
                    res.status(500).json(err);
                    return;
                }
                res.json("Oferta de emprego eliminada permanentemente com sucesso.");
            })
        });
    }
};

exports.candidaturaOfertaEmprego = (req, res) => {
    var ofertaEmprego = new Promise((resolve, reject) => {
        OfertaEmprego.findOne({ _id: ObjectId(req.body.idOferta), arquivado: false, dataLimite: { $gte: Date.now() - 86400000 } }, (err, oferta) => {

            resolve(oferta);
        });
    });

    ofertaEmprego.then(oferta => {
        if (oferta.curriculo && !req.file) {
            return res.status(400).json("O currículo é de caráter obrigatório.")
        }
        User.findById(oferta.inseridoPor).exec(async (err, user) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
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
                to: [user.email],
                subject: 'Foi realizado uma nova candidatura relativa à oferta: ' + oferta.nome,
                html: `
        <h2>Detalhes da Oferta de Emprego:</h2>
        <ul>  
          <li>Nome: ${oferta.nome}</li>
          <li>Função: ${oferta.funcao}</li>
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
    });
};
