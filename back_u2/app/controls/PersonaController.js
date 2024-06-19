'use strict';
const { validationResult } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcypt = require('bcrypt');
const salRounds = 8;

class PersonaController {
    async listar(req, res) {
        var listar = await persona.findAll({
            attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'identificacion', 'tipo_identificacion'],
            include: [{ model: cuenta, as: 'cuenta', attributes: ['usuario'] }, { model: rol, as: 'rol', attributes: ['nombre'] }]
        });
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async obtener(req, res) {
        const external = req.params.external;
        var listar = await persona.findOne({
            where: { external_id: external }, include: { model: cuenta, as: 'cuenta', attributes: ['usuario'] },
            attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'identificacion', 'tipo_identificacion']
        });
        if (listar === null) {
            listar = {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, data: listar });
    }

    async listar_por_rol(req, res) {
        const external = req.params.external;
        // Continuar con la búsqueda del rol y las personas
        var roles = await rol.findOne({
            where: { external_id: external },
            attributes: ['id']
        });

        if (!roles) {
            // Manejar el caso en el que no se encuentre el rol con el external proporcionado
            res.status(404);
            return res.json({ msg: 'Rol no encontrado', code: 404 });
        }

        const rolId = roles.id;

        var listar = await persona.findAll({
            where: { id_rol: rolId },
            include: { model: cuenta, as: 'cuenta', attributes: ['usuario'] },
            attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'identificacion', 'tipo_identificacion']
        });

        if (listar === null || listar.length === 0) {
            // Cambiado para verificar si la lista está vacía
            listar = [];
        }

        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('identificacion') &&
            req.body.hasOwnProperty('nombres') &&
            req.body.hasOwnProperty('apellidos') &&
            req.body.hasOwnProperty('direccion') &&
            req.body.hasOwnProperty('clave') &&
            req.body.hasOwnProperty('correo') &&
            req.body.hasOwnProperty('external_rol')) {
            let errors = validationResult(req);
            if (errors.isEmpty()) {
                var rol_id = req.body.external_rol;
                if (rol_id != undefined) {
                    let rolAux = await rol.findOne({ where: { external_id: rol_id } });
                    console.log(rolAux);
                    if (rolAux) {
                        var claveHash = function (clave) {
                            return bcypt.hashSync(clave, bcypt.genSaltSync(salRounds), null);
                        };
                        var data = {
                            identificacion: req.body.identificacion,
                            tipo_identificacion: req.body.dni_tipo,
                            nombres: req.body.nombres,
                            apellidos: req.body.apellidos,
                            direccion: req.body.direccion,
                            id_rol: rolAux.id,
                            cuenta: {
                                usuario: req.body.correo,
                                clave: claveHash(req.body.clave)
                            }

                        }
                        let transaction = await models.sequelize.transaction();
                        try {
                            await persona.create(data, { include: [{ model: models.cuenta, as: "cuenta" }], transaction });
                            await transaction.commit();
                            res.json({ msg: "Se han registrado los datos", code: 200 });
                        } catch (error) {
                            if (transaction) await transaction.rollback();
                            if (error.errors && error.errors[0].message) {
                                res.json({ msg: error.errors[0].message, code: 200 });
                            } else {
                                res.json({ msg: error.message, code: 200 });
                            }
                        }
                    } else {
                        res.status(400);
                        res.json({ msg: "Datos no encontrados", code: 400 });
                    }
                } else {
                    res.status(400);
                    res.json({ msg: "ROL NO EXISTE", code: 400 });
                }
            } else {
                res.status(400);
                res.json({ msg: "Datos faltantes", code: 400});
            }
        } else {
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400});
        }
    }

    async modificar(req, res) {
        var person = await persona.findOne({ where: { external_id: req.body.external } });
        if (person === null) {
            res.status(400);
            res.json({ msg: 'No existe registro', code: 400 });
        } else {
            var uuid = require('uuid');
            person.identificacion = req.body.identificacion;
            person.tipo_identificacion = req.body.dni_tipo;
            person.nombres = req.body.nombres;
            person.apellidos = req.body.apellidos;
            person.direccion = req.body.direccion;
            person.id_rol = req.body.id;
            person.external_id = uuid.v4();
            var result = await person.save();
            if (result === null) {
                res.status(400);
                res.json({ msg: 'No se ha modificado sus datos', code: 400 });
            } else {
                res.status(200);
                res.json({ msg: 'Se ha modificado sus datos', code: 200 });
            }
        }
    }

}
module.exports = PersonaController;