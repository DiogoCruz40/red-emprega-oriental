const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json("Token não dado!");
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json("Não autorizado!");
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        next();
        return;
    })
    res.status(403).json("Administrador não encontrado.");
    return;
};

isAdminOmni = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        if (!user) {
            return res.status(404).send({
              accessToken: null,
              message: "Utilizador não encontrado."
            });
          }

        if (user.omnipotente) {
            next();
            return;
        } else {
            res.status(403).json("Não tem permissões!");
            return;
        }
    });
}

const authJwt = {
    verifyToken,
    isAdmin,
    isAdminOmni
};
module.exports = authJwt;