var mongoose = require('mongoose');

var ofertaEmpregaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    funcao: String,
    local: String,
    horario: String,
    remuneracao: String,
    beneficios: String,
    outrasRegalias: String,
    contacto: String,
    email: String,
    dataLimite: Date,
    observacoes: String,
    perfilExperienciaProfissional: String,
    curriculo: Boolean,
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

module.exports = mongoose.model('ofertaEmprego', ofertaEmpregaSchema);