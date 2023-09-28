const express = require('express');
const authController = require("./controllers/auth");
const { authJwt } = require("./middlewares");
const gestaoAdminsController = require("./controllers/gestao-admins");
const ofertaEmpregoController = require("./controllers/oferta-emprego");
const ofertaFormacaoController = require("./controllers/oferta-formacao");
const noticiaController = require("./controllers/noticia");

const contactoController = require("./controllers/contacto");
const newslettercontroller = require('./controllers/newsletter');
const fileController = require('./controllers/file')
const teste = require("./middlewares/emailManager");
const multer = require('multer');
const upload = multer({
  dest: './public/uploads/',
  limits: { fileSize: 1548576 }
});

exports = module.exports = function (app) {

  app.post("/api/auth/iniciar-sessao", authController.signin);

  //app.post("/api/auth/registar", authController.signup);

  app.get('/hello', (req, res) => res.send('Hello World!'))

  app.put(
    "/api/auth/nome",
    [authJwt.verifyToken],
    authController.alterarNome
  );

  app.put(
    "/api/auth/password",
    [authJwt.verifyToken],
    authController.alteraPassword
  );

  app.get(
    "/api/gestao-admins",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    gestaoAdminsController.getAdmins
  );

  app.post(
    "/api/gestao-admins",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    gestaoAdminsController.addAdmin
  );

  app.delete(
    "/api/gestao-admins",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    gestaoAdminsController.removeAdmin
  );

  app.put(
    "/api/gestao-admins",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    gestaoAdminsController.alterapassAdmin
  );

  // ------------------------------- OFERTAS DE EMPREGO ------------------------------- //
  app.post(
    "/api/oferta-emprego", upload.array('files', 2),
    [authJwt.verifyToken],
    ofertaEmpregoController.addOfertaEmprego
  );

  app.get(
    "/api/oferta-emprego",
    [authJwt.verifyToken],
    ofertaEmpregoController.getOfertasEmprego
  );

  app.get(
    "/api/oferta-emprego/public",
    [],
    ofertaEmpregoController.getOfertasEmpregoPublic
  );

  app.put(
    "/api/oferta-emprego", upload.array('files', 2),
    [authJwt.verifyToken],
    ofertaEmpregoController.updateOfertaEmprego
  );

  app.delete(
    "/api/oferta-emprego",
    [authJwt.verifyToken],
    ofertaEmpregoController.deleteOfertaEmprego
  );

  app.post(
    "/api/oferta-emprego/candidatura", upload.single('cv'),
    [],
    ofertaEmpregoController.candidaturaOfertaEmprego
  );

  app.get(
    "/api/oferta-emprego/arquivado",
    [],
    ofertaEmpregoController.getOfertasEmpregoArquivado
  );

  app.get(
    "/api/oferta-emprego/expirado",
    [],
    ofertaEmpregoController.getOfertasEmpregoExpirado
  );

  app.put(
    "/api/oferta-emprego/expirado",
    [authJwt.verifyToken],
    ofertaEmpregoController.renovarOfertaEmprego
  );

  app.put(
    "/api/oferta-emprego/arquivado",
    [authJwt.verifyToken],
    ofertaEmpregoController.desarquivarOfertaEmprego
  );

  app.delete(
    "/api/oferta-emprego/hard",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    ofertaEmpregoController.deleteOfertaEmpregoHard
  );

  // ------------------------------- OFERTAS DE FORMAÇÃO ------------------------------- //

  app.post(
    "/api/oferta-formacao", upload.array('files', 2),
    [authJwt.verifyToken],
    ofertaFormacaoController.addOfertaFormacao
  );

  app.get(
    "/api/oferta-formacao",
    [authJwt.verifyToken],
    ofertaFormacaoController.getOfertasFormacao
  );

  app.get(
    "/api/oferta-formacao/public",
    [],
    ofertaFormacaoController.getOfertasFormacaoPublic
  );

  app.put(
    "/api/oferta-formacao", upload.array('files', 2),
    [authJwt.verifyToken],
    ofertaFormacaoController.updateOfertaFormacao
  );

  app.delete(
    "/api/oferta-formacao",
    [authJwt.verifyToken],
    ofertaFormacaoController.deleteOfertaFormacao
  );

  app.post(
    "/api/oferta-formacao/candidatura",
    [],
    ofertaFormacaoController.candidaturaOfertaFormacao
  );

  app.get(
    "/api/oferta-formacao/arquivado",
    [],
    ofertaFormacaoController.getOfertasFormacaoArquivado
  );

  app.put(
    "/api/oferta-formacao/arquivado",
    [authJwt.verifyToken],
    ofertaFormacaoController.desarquivaOfertaFormacao
  );

  app.get(
    "/api/oferta-formacao/expirado",
    [],
    ofertaFormacaoController.getOfertasFormacaoExpirado
  );

  app.put(
    "/api/oferta-formacao/expirado",
    [authJwt.verifyToken],
    ofertaFormacaoController.renovaOfertaFormacao
  );

  app.delete(
    "/api/oferta-formacao/hard",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    ofertaFormacaoController.deleteOfertaFormacaoHard
  );
  // ------------------------------- CONTACTO ------------------------------- //

  app.post(
    "/api/contactos",
    [],
    contactoController.submitContacto
  );

  app.post(
    "/api/captcha",
    [],
    contactoController.captchaValidator
  );
  // ------------------------------- Newsletter ------------------------------- //
  app.post(
    "/api/newsletter",
    [],
    newslettercontroller.submitemail
  );

  app.post(
    "/api/unsubscribe",
    [],
    newslettercontroller.submitunsubscribe
  );

  // ------------------------------- File ------------------------------- //
  app.get(
    "/api/file",
    [],
    fileController.getFile
  );

  // ------------------------------- NOTICIAS ------------------------------- //

  app.post(
    "/api/noticia", upload.fields([{ name: 'preVisualizar', maxCount: 1 }, { name: 'anexos', maxCount: 2 }]),
    [authJwt.verifyToken],
    noticiaController.addNoticia
  );

  app.get(
    "/api/noticia",
    [authJwt.verifyToken],
    noticiaController.getNoticias
  );

  app.get(
    "/api/noticia/public",
    [],
    noticiaController.getNoticiasPublic
  );

  app.put(
    "/api/noticia", upload.fields([{ name: 'preVisualizar', maxCount: 1 }, { name: 'anexos', maxCount: 2 }]),
    [authJwt.verifyToken],
    noticiaController.updateNoticia
  );

  app.delete(
    "/api/noticia",
    [authJwt.verifyToken],
    noticiaController.deleteNoticia
  );

  app.get(
    "/api/noticia/arquivado",
    [],
    noticiaController.getNoticiasArquivado
  );

  app.put(
    "/api/noticia/arquivado",
    [authJwt.verifyToken],
    noticiaController.desarquivarNoticia
  );

  app.delete(
    "/api/noticia/hard",
    [authJwt.verifyToken, authJwt.isAdminOmni],
    noticiaController.deleteNoticiaHard
  );

}

