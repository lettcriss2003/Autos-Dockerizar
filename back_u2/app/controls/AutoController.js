'use strict';
var formidable = require('formidable');
var extensiones = ['png', 'jpg', 'jpeg'];
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
const { Op } = require('sequelize');
var auto = models.auto;
var marca = models.marca;
const bcypt = require('bcrypt');
const salRounds = 8;
const fs = require('fs');
//var formidable=require('f');


class AutoController {
    async listar(req, res) {
        var listar = await auto.findAll({
            attributes: ['anio', 'placa', 'color', 'costo', 'external_id', 'estado', 'duenio', 'foto'],
            include: { model: marca, as: 'marca', attributes: ['nombre', 'modelo', 'pais'] }
        });
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async listarDisponibles(req, res) {
        try {
            var listar = await auto.findAll({
                where: { estado: 'DISPONIBLE' },
                attributes: ['anio', 'placa', 'color', 'costo', 'external_id', 'duenio', 'foto'],
                include: { model: marca, as: 'marca', attributes: ['nombre', 'modelo', 'pais'] }
            });
            res.status(200).json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }

    async listarVendidos(req, res) {
        var listar = await auto.findAll({
            where: { duenio: { [Op.not]: 'NO_DATA' } },
            attributes: ['anio', 'placa', 'color', 'costo', 'external_id', 'estado', 'duenio', 'foto'],
            include: { model: marca, as: 'marca', attributes: ['nombre', 'modelo', 'pais'] }
        });
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async obtener(req, res) {
        const external = req.params.external;
        var listar = await auto.findOne({
            where: { external_id: external }, include: { model: marca, as: 'marca', attributes: ['nombre', 'modelo', 'pais'] },
            attributes: ['anio', 'placa', 'color', 'costo', 'external_id', 'estado', 'foto']
        });
        if (listar === null) {
            listar = {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async numAuto(req, res) {
        const contar = await auto.count();
        res.json({ msg: 'OK!', code: 200, info: contar });
    }

    async guardar(req, res) {
        console.log(req.body);
        let errors = validationResult(req);
        if (req.body.hasOwnProperty('anio') &&
            req.body.hasOwnProperty('placa') &&
            req.body.hasOwnProperty('color') &&
            req.body.hasOwnProperty('costo') &&
            req.body.hasOwnProperty('external_marca')) {
            if (errors.isEmpty()) {
                var marca_id = req.body.external_marca;
                if (marca_id != undefined) {
                    let marcaAux = await marca.findOne({ where: { external_id: marca_id } });
                    console.log("marcaaaaa",marcaAux);
                    if (marcaAux) {
                        //data arreglo asociativo= es un direccionario = clave:valor
                        var data = {
                            anio: req.body.anio,
                            placa: req.body.placa,
                            color: req.body.color,
                            costo: req.body.costo,
                            foto: 'auto.png',
                            id_marca: marcaAux.id
                        }
                        console.log("data", data);
                        let transaction = await models.sequelize.transaction();
                        try {
                            await auto.create(data, { transaction });
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
                    res.json({ msg: "Faltan datos", code: 400 });
                }
            } else {
                res.status(400);
                res.json({ msg: "Datos faltantes", code: 400, errors: errors });
            }
        } else {
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400, errors: errors });
        }
    }

    async modificarFoto(req, res) {
        var form = new formidable.IncomingForm(), files = [];
        form.on('file', function (field, file) {
            files.push(file);
        }).on('end', function () {
            console.log('OK');
        });

        form.parse(req, async function (err, fields) {
            console.log('Campos del formulario:', fields);
            console.log(files);
            const totalSize = files.reduce((acc, file) => acc + file.size, 0);
            if (totalSize > 2 * 1024 * 1024) {
                // Verificar si el tamaño del archivo excede el límite (2MB)
                res.status(400);
                res.json({ msg: 'error', tag: 'Archivo demasiado grande. Máximo permitido: 2MB', code: 400 });
                return; // Detener la ejecución si el archivo excede el tamaño límite
            }
            let listado = files;
            let nameArchivo = fields.nameArchivo[0];
            console.log('aaaaaaaaaaaaaaa', nameArchivo);
            let external = fields.external[0];
            console.log('bbbbbbbbbb', external);
            var noti = await auto.findOne({ where: { external_id: external } });
            if (noti === null) {
                console.log("valio");
                res.status(400);
                res.json({
                    msg: "No existe registro",
                    code: 400
                });
            } else {
                for (let index = 0; index < listado.length; index++) {
                    var file = listado[index];
                    var extenseion = file.originalFilename.split('.').pop().toLowerCase();
                    if (extensiones.includes(extenseion)) {
                        console.log(extenseion);
                        const name = (noti.foto === "auto.png") ? nameArchivo + "." + extenseion : noti.foto;
                        fs.rename(file.filepath, "public/images/" + name, async function (error) {
                            if (error) {
                                res.status(400);
                                res.json({ msg: 'error', tag: "nose pudo guardar", code: 400 });
                            } else {
                                var uuid = require('uuid');
                                noti.foto = name,
                                noti.external_id = uuid.v4();
                                var result = await noti.save();
                                if (result === null) {
                                    res.status(400);
                                    res.json({
                                        msg: "No se ha modificado sus datos",
                                        code: 400
                                    });
                                } else {
                                    res.status(200);
                                    res.json({
                                        msg: "Se ha modificado sus datos",
                                        code: 200
                                    });
                                }
                            }
                        });
                    } else {
                        res.status(400);
                        res.json({ msg: 'error', tag: "solo soporta png y jpg", code: 400 });
                    }
                }
            }
        });

    }


    async modificar(req, res) {
        console.log("ENTRO EN EL METODO")
        var carrito = await auto.findOne({ where: { external_id: req.body.external_id } });
        if (carrito === null) {
            console.log("valio");
            res.status(400);
            res.json({
                msg: "No existe registro",
                code: 400
            });
        } else {
            if (carrito.estado === "DISPONIBLE") {
                var uuid = require('uuid');
                carrito.anio = req.body.anio,
                carrito.costo = req.body.costo;
                carrito.placa = req.body.placa;
                carrito.color = req.body.color;
                carrito.external_id = uuid.v4();
                var result = await carrito.save();
                if (result === null) {
                    res.status(400);
                    res.json({
                        msg: "No se ha modificado sus datos",
                        code: 400
                    });
                } else {
                    res.status(200);
                    res.json({
                        msg: "Se ha modificado sus datos",
                        code: 200
                    });
                }
            } else {
                res.status(201);
                res.json({
                    msg: "El auto no se puede modificar ya que esta vendido!!!",
                    code: 201
                });
            }

        }
    }
}

module.exports = AutoController;