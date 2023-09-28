var mongoose = require('mongoose');

var newsletterSchema = new mongoose.Schema({

    email:
    {
      type:String,
      unique:true,
      required:true
    },
    arquivado:
    {
      type:Boolean,
      default:false,
      required:true
    }
  })

module.exports = mongoose.model('newsletter', newsletterSchema);