var mongoose = require('mongoose');

var ofertaFormacaoSchema = new mongoose.Schema({
    nome: String,
    areaFormacao: String,
    local: String,
    horario: String,
    contacto: String,
    email: String,
    dataLimite: Date,
    observacoes: String,
    dataInsercao: Date,
    arquivado:
    {
        type: Boolean,
        default: false,
        required: true
    },
    newsletter: {
        type: Boolean,
        default: false,
        required: true
    },
    inseridoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'administrador'
    },
    emailsAEnviar: [{
        type: String
    }],
    anexos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file'
    }],
    numCandidaturas: {
        type: Number,
        default: 0,
        required: true
    },
})

module.exports = mongoose.model('ofertaFormacao', ofertaFormacaoSchema);