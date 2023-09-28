var mongoose = require( 'mongoose' );

var eventosSchema = new mongoose.Schema({
    nome: String,
    morada: String,
    email: String,
    descricao: String,
    img: { data: Buffer, contentType: String },
})