var cron = require('node-cron');
const db = require("../models");
const User = db.user;
const Email = db.email;
const File = db.file;
const Noticia = db.noticia;
const emailManager = require("../middlewares/emailManager");
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment-timezone');
const fs = require("fs");

const noticia = require("../models/noticia");
const { file } = require('../models');
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink);

//TODO: eliminar campos desnecessários
exports.getNoticiasPublic = (req, res) => {

    const page = parseInt(req.query.page);
    const PAGE_SIZE = 10;
    const query =
        [
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
            { $skip: page * PAGE_SIZE },
            { $limit: PAGE_SIZE },
            {
                $lookup: {
                    from: "files",
                    localField: "anexos",
                    foreignField: "_id",
                    as: "anexos"
                }
            },
            {
                $lookup: {
                    from: "files",
                    localField: "preVisualizar",
                    foreignField: "_id",
                    as: "preVisualizar"
                }
            },
            {
                $unwind: { "path": '$preVisualizar', "preserveNullAndEmptyArrays": true },
            },
            {
                $match: {
                    arquivado: false,
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
                    "preVisualizar.data": 0,
                    "preVisualizar.type": 0
                }
            }
        ]
    noticia.aggregate(query, (err, noticias) => {
        if (err) {
            return res.status(400).json(err);
        }
        noticia.countDocuments(query).exec((countError, count) => {
            if (countError) {
                return res.status(400).json(countError);
            }
            return res.status(200).json({
                total: count,
                page: page,
                content: noticias,
                totalPages: Math.ceil(count / PAGE_SIZE)
            });
        });
    }
    );

};


exports.getNoticias = (req, res) => {

    noticia.aggregate([
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
            $lookup: {
                from: "files",
                localField: "preVisualizar",
                foreignField: "_id",
                as: "preVisualizar"
            }
        },
        {
            $unwind: { "path": '$preVisualizar', "preserveNullAndEmptyArrays": true },
        },
        {
            $match: {
                arquivado: false,
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
                "preVisualizar.data": 0,
                "preVisualizar.type": 0
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

exports.getNoticiasArquivado = (req, res) => {

    noticia.aggregate([
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
            $lookup: {
                from: "files",
                localField: "preVisualizar",
                foreignField: "_id",
                as: "preVisualizar"
            }
        },
        {
            $unwind: { "path": '$preVisualizar', "preserveNullAndEmptyArrays": true },
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
                "preVisualizar.data": 0,
                "preVisualizar.type": 0
            }
        }], (err, users) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            return res.status(200).json(users);
        });

};

exports.addNoticia = (req, res) => {
    User.findById(req.userId).exec(async (err, user) => {
        if (err) {
            res.status(400).json(err);
            return;
        }
        var ficheirosList = [];
        var preVisualizar;
        async function saveFiles() {
            for (let file of req.files['anexos']) {
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

        async function savePrevisualizar() {
            var ficheiroSync = fs.readFileSync(req.files['preVisualizar'][0].path);

            const newFile = new File({
                type: req.files['preVisualizar'][0].mimetype,
                data: ficheiroSync,
                fileName: req.files['preVisualizar'][0].originalname
            })
            console.log(newFile)
            await newFile.save().then(fileSaved => {
                preVisualizar = fileSaved._id;
            });
            await unlinkAsync(req.files['preVisualizar'][0].path);
        }
        if (req.files['anexos'])
            await saveFiles();

        if (req.files['preVisualizar'] && req.files['preVisualizar'].length) {
            if (req.files['preVisualizar'][0].mimetype != "image/jpg" &&
                req.files['preVisualizar'][0].mimetype != "image/png" &&
                req.files['preVisualizar'][0].mimetype != "image/jpeg") {
                return res.status(400).json("Imagem de Pré-Visualizar não é do tipo jpg/png/jpeg.");
            }
            await savePrevisualizar();
        }
        const noticia = new Noticia({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            dataInsercao: moment(new Date(), 'UTC').utcOffset(0, true).toDate(),
            inseridoPor: ObjectId(user._id),
            anexos: ficheirosList,
            preVisualizar: preVisualizar
        });
        noticia.save((err, noticia) => {
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
            res.json("Notícia adicionada com sucesso.");

        });


    });
}

exports.updateNoticia = (req, res) => {

    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {

        objUpdate = {
            "titulo": req.body.titulo,
            "descricao": req.body.descricao,
            "preVisualizar": null,
            "anexos": []
        }

        User.findById(req.userId).exec(async (err, user) => {
            if (err) {
                res.status(400).json(err);
                return;
            }
            var ficheirosList = [];
            var preVisualizar = null;
            async function saveFiles() {
                for (let file of req.files['anexos']) {
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
                objUpdate.anexos = ficheirosList;
                return;
            }

            async function savePrevisualizar() {
                var ficheiroSync = fs.readFileSync(req.files['preVisualizar'][0].path);

                const newFile = new File({
                    type: req.files['preVisualizar'][0].mimetype,
                    data: ficheiroSync,
                    fileName: req.files['preVisualizar'][0].originalname
                })
                await newFile.save().then(fileSaved => {
                    preVisualizar = fileSaved._id;
                });
                await unlinkAsync(req.files['preVisualizar'][0].path);
                objUpdate.preVisualizar = preVisualizar

            }
            if (req.files['anexos'])
                await saveFiles();
            if (req.files['preVisualizar'] && req.files['preVisualizar'].length) {
                if (req.files['preVisualizar'][0].mimetype != "image/jpg" &&
                    req.files['preVisualizar'][0].mimetype != "image/png" &&
                    req.files['preVisualizar'][0].mimetype != "image/jpeg") {
                    return res.status(400).json("Imagem de Pré-Visualizar não é do tipo jpg/png/jpeg.");
                }
                await savePrevisualizar();
            }
            async function eliminaFicheirosAntigos() {
                Noticia.findOne({ _id: req.body._id }, (errOferta, noticia) => {
                    if (errOferta) {
                        res.status(500).json(err);
                        return;
                    }
                    if (noticia.preVisualizar) {
                        noticia.anexos.push(noticia.preVisualizar);
                    }
                    File.remove({ _id: { $in: noticia.anexos } }, (errDocs, docs) => {
                        if (errDocs) {
                            res.status(500).json(err);
                            return;
                        }
                    })

                });
            }
            await eliminaFicheirosAntigos();

            Noticia.findByIdAndUpdate(req.body._id, objUpdate, (err, data) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json("Oferta de emprego atualizada com sucesso.");
            });
        });
    }
}

exports.desarquivarNoticia = (req, res) => {
    if (!req.body._id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        Noticia.findByIdAndUpdate(req.body._id, {
            "arquivado": false
        }, (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json("Notícia desarquivada com sucesso.");
        });
    }
}

exports.deleteNoticia = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        Noticia.findByIdAndUpdate(req.query.id, { "arquivado": true }, (err, data) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json("Notícia arquivada com sucesso.");
        });
    }
};


exports.deleteNoticiaHard = (req, res) => {
    if (!req.query.id) {
        res.status(400).json('Id não pode ser nulo.')
    }
    else {
        Noticia.findOneAndDelete({ _id: req.query.id }, (errOferta, noticia) => {
            if (errOferta) {
                res.status(500).json(err);
                return;
            }
            if (noticia.preVisualizar) {
                noticia.anexos.push(noticia.preVisualizar);
            }
            File.remove({ _id: { $in: noticia.anexos } }, (errDocs, docs) => {
                if (errDocs) {
                    res.status(500).json(err);
                    return;
                }
                res.json("Notícia eliminada permanentemente com sucesso.");
            })
        });
    }
};
