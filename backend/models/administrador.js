var mongoose = require( 'mongoose' );

var administradorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  password: String,
  omnipotente: Boolean,
  resetpassword:
  {
    type:Boolean,
    required:true,
    default:false
  },
  date:{
    type:Number,
    required:true,
    default:parseInt((new Date().getFullYear().toString() + new Date().getMonth().toString() + new Date().getDate().toString() + (new Date().getUTCHours() + 1  === 24 ? 0 : new Date().getUTCHours() + 1 ).toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString()),10)
  },
  sent:{
    type:Boolean,
    required:true,
    default:false
  }
});


module.exports = mongoose.model('administrador', administradorSchema);