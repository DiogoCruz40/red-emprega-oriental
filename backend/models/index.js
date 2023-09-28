const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./administrador");
db.email = require("./email");
db.ofertaFormacao = require("./oferta-formacao");
db.ofertaEmprego = require("./oferta-emprego");
db.newsletter = require("./newsletter")
db.file = require("./files");
db.noticia = require("./noticia")
module.exports = db;