var mongoose = require( 'mongoose');

var EmailSchema = new mongoose.Schema({

    assunto: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    to: {
        type: [String],
        required: true
    },
    sended: {
        type:Boolean,
        default:false,
        required:true
    },
    onqueue:{
        type:Boolean,
        default:true,
        required:true
    },
    dataInsercao:{
        type:Date,
        default: Date.now(),
        required:true
    },
    anexo:{
        filename: String,
        path: String
    }
});

module.exports = mongoose.model('email', EmailSchema);