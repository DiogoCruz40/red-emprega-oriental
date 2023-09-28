var mongoose = require('mongoose');

var noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
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
        ref: 'administrador',
        required: true
    },
    preVisualizar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file'
    },
    anexos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file'
    }],
})

module.exports = mongoose.model('noticia', noticiaSchema);