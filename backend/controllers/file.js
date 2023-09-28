const db = require("../models");
const File = db.file;

exports.getFile = (req, res) => {

    if (!req.query.id) {
        return res.status(400).json('Id não pode ser nulo.')
    }
    File.findById(req.query.id).exec((err, file) => {
        if (err) {
            return res.status(400).json(err);
        }
        if (!file) {
            return res.status(400).json("Ficheiro não encontrado.");
        }
        const fileToSend = Buffer.from(file.data, 'base64');

        res.set({
            'Content-Type': file.type + ';base64',
            'Content-Disposition': 'attachment;filename=' + file.fileName,
            'Access-Control-Expose-Headers': 'Content-Disposition' // <== ** Solution **
          })
        return res.send(fileToSend);
    });
};
