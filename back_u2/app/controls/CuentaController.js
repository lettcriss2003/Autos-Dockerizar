'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcypt = require('bcrypt');
const salRounds = 8;
let jwt = require('jsonwebtoken');

class CuentaController {

    async sesion(req, res) {
        console.log(req);
        if (req.body.hasOwnProperty('usuario') &&
            req.body.hasOwnProperty('clave')) {
                var login = await cuenta.findOne({
                    where: { usuario: req.body.usuario },
                    include: {
                        model: persona,
                        as: 'persona',
                        attributes: ['apellidos', 'nombres', 'id_rol']
                    }
                });
                var login2 = await rol.findOne({
                    where: { id: login.persona.id_rol }
                });
                //console.log(login);
                if (login === null) {
                    res.status(400);
                    res.json({
                        msg: "cuenta no encontrada!",
                        code: 400
                    });
                } else {
                    res.status(200);
                    var isClaveValida = function (clave, claveUser) {
                        return bcypt.compareSync(claveUser, clave);
                    }
                    if (login.estado) {
                        if (isClaveValida(login.clave, req.body.clave)) { //login.clave---BD //req.body.clave---lo que manda el usuario
                            const tokenData = {
                                external: login.external_id,
                                usuario: login.usuario,
                                check: true
                            };
                            require('dotenv').config();
                            const llave = process.env.KEY_TNCP;
                            const token = jwt.sign(tokenData, llave, {
                                expiresIn: '12h'
                            });
                            res.json({
                                code: 200,
                                msg: "Bienvenid@ " + login.persona.nombres + ' ' + login.persona.apellidos,
                                info: {
                                    token: token,
                                    id: login2.nombre,
                                    external: login.external_id,
                                    user: login.persona.nombres + ' ' + login.persona.apellidos,
                                    correo: login.usuario,
                                }
                            });
                        } else {
                            res.json({
                                msg: "CLAVE INCORRECTA",
                                code: 201
                            });
                        }
                    } else {
                        res.json({
                            msg: "CUENTA DESACTIVADA",
                            code: 201
                        });
                    }
                }
            }else {
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400});
        }
        //console.log(res.json());
    }

}
module.exports = CuentaController;