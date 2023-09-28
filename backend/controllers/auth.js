const config = require("../config/auth");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function checkPassword(str) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}
/* Registar inativo 27/10/2021
exports.signup = (req, res) => {
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (user) {
      res.status(400).json("Já existe um utilizador registado com este email.");
      return;
    }

    const userToSave = new User({
      nome: req.body.nome,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      omnipotente: req.body.omnipotente
    });


    userToSave.save((err, userSaved) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json("Registo feito com sucesso! Já pode iniciar sessão " + userSaved.nome);

    });
  });
};
*/
exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      if (!user) {
        return res.status(404).json("Não foi encontrado um administrador com este email."
        );
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(404).json("Utilizador não encontrado ou password incorreta.");
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).json({
        id: user._id,
        nome: user.nome,
        email: user.email,
        omnipotente: user.omnipotente,
        accessToken: token
      });
    });
};

exports.alterarNome = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    user.nome = req.body.nome;

    user.save((err, user) => {
      if (err) {
        res.status(400).json(err);
        return;
      }
    });
    res.status(200).json({
      nome: user.nome,
      email: user.email,
      omnipotente: user.omnipotente,
    });
  });
};

exports.alteraPassword = (req, res) => {

  if (!req.body.newPassword && !checkPassword(req.body.newPassword)) {
    return res.status(400).json('Palavra-passe tem de ter pelo menos 8 caracteres, 1 letra grande, 1 letra pequena e 1 carácter especial.');

  }
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(400).json("A palavra-passe atual está errada.");
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 8)

    user.save((err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
    });
    res.status(200).json({
      nome: user.nome,
      email: user.email,
      omnipotente: user.omnipotente,
    });
  });

};
