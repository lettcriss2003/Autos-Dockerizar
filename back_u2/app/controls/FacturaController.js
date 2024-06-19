'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models');
var factura = models.factura;
var detalle = models.detalle;
var cuenta = models.cuenta;
var auto = models.auto;
var persona = models.persona;

const bcypt = require('bcrypt');

const salRounds = 8;

class FacturaController {
    async listar(req, res) {
        var listar = await factura.findAll({
            attributes: ['fecha_emision', 'numero_factura', 'sub_total',
                'iva', 'recargo', 'total_pagar', 'external_id', 'estado'],
            include: { model: persona, as: 'persona', attributes: ['apellidos', 'nombres', 'direccion', 'identificacion', 'tipo_identificacion'] }
        });
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async obtener(req, res) {
        const external = req.params.external;
        var listar = await factura.findOne({
            where: { external_id: external }, include: { model: cuenta, as: 'cuenta', attributes: ['usuario'] },
            attributes: ['apellidos', 'nombres', 'external_id', 'direccion', 'identificacion', 'tipo_identificacion']
        });
        if (listar === null) {
            listar = {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    async facturar(req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            var auto_id = req.body.external_auto;
            var factura_id = req.body.external_factura;
            if ((auto_id != undefined) && (factura_id != undefined)) {
                let autoAux = await auto.findOne({ where: { external_id: auto_id } });
                let valores = await factura.findOne({ where: { external_id: factura_id } });
                console.log(autoAux);
                if (autoAux && valores) {
                    console.log(autoAux.estado);
                    if (autoAux.estado === 'DISPONIBLE') {
                        //data arreglo asociativo= es un direccionario = clave:valor
                        var data = {
                            id_factura: valores.id,
                            id_auto: autoAux.id
                        }
                        let transaction = await models.sequelize.transaction();
                        try {
                            console.log("AQUIIIIIIIII  ")
                            let detalleAux = await detalle.create(data, { transaction });
                            console.log("AQUIIIIIIIII  DESPUES")
                            await transaction.commit();
                            autoAux.estado = 'VENDIDO';
                            var resultA = await autoAux.save();
                            if (resultA === null) {
                                res.status(400);
                                res.json({ msg: 'No se ha modificado sus datos', code: 400 });
                            } else {
                                res.status(200);
                                res.json({ msg: 'Auto vendido', code: 200 });
                            }
                            console.log("AUTOOOOOOOOO")
                            if (valores === null) {
                                res.status(400);
                                res.json({ msg: 'No existe el detalle', code: 400 });
                            } else {
                                //CONDICIONAL DEL RECARGO ADICIONAL
                                if (autoAux.color == 'BLANCO' || autoAux.color == 'PLATA') {
                                    try {
                                        // console.log("entro",valores.sub_total);
                                        valores.sub_total = Number(autoAux.costo) + Number(valores.sub_total);
                                        //console.log("2",valores.sub_total);
                                        valores.iva = ((autoAux.costo * 0.12) + Number(valores.iva)),
                                            //console.log("3",valores.iva);
                                            valores.total_pagar = Number(valores.iva) + Number(valores.sub_total);
                                        // console.log("--------",valores.total_pagar);
                                        let personaAux = await persona.findOne({ where: { id: valores.id_persona } });
                                        autoAux.duenio = personaAux.identificacion;
                                        await autoAux.save();
                                        var result = await valores.save();
                                        if (result === null) {
                                            res.status(400);
                                            res.json({ msg: 'No se ha guardado el detalle en factura', code: 400 });
                                        } else {
                                            res.status(200);
                                            res.json({ msg: 'Se guardado el detalle en factura', code: 200 });
                                        }
                                    } catch (error) {
                                        await t.rollback();
                                        console.error(error);
                                        res.status(500);
                                        res.json({ msg: 'Error interno del servidor', code: 500 });
                                    }

                                } else {
                                    try {
                                        valores.recargo = 500;
                                        // console.log("entro",valores.sub_total);
                                        valores.sub_total = Number(autoAux.costo) + Number(valores.sub_total);
                                        //console.log("2",valores.sub_total);
                                        valores.iva = ((autoAux.costo * 0.12) + Number(valores.iva)),
                                            //console.log("3",valores.iva);
                                            valores.total_pagar = Number(valores.iva) + Number(valores.sub_total) + Number(valores.recargo);
                                        // console.log("--------",valores.total_pagar);
                                        let personaAux = await persona.findOne({ where: { id: valores.id_persona } });
                                        autoAux.duenio = personaAux.identificacion;
                                        await autoAux.save();
                                        var result = await valores.save();
                                        if (result === null) {
                                            res.status(400);
                                            res.json({ msg: 'No se ha guardado el detalle en factura', code: 400 });
                                        } else {
                                            res.status(200);
                                            res.json({ msg: 'Se guardado el detalle en factura', code: 200 });
                                        }
                                    } catch (error) {
                                        await t.rollback();
                                        console.error(error);
                                        res.status(500);
                                        res.json({ msg: 'Error interno del servidor', code: 500 });
                                    }

                                }
                            }
                        } catch (error) {
                            if (transaction) await transaction.rollback();
                            if (error.errors && error.errors[0].message) {
                                res.status(200);
                                res.json({ msg: error.errors[0].message, code: 200 });
                            } else {
                                res.status(500);
                                res.json({ msg: 'Error interno del servidor', code: 500 });
                            }
                        }
                    } else {
                        res.status(200);
                        res.json({ msg: "Auto no disponible", code: 200, errors: errors });
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
        // console.log("-----",detalleAux.id_auto);

    }

    async crearFactura(req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            var persona_id = req.body.external_persona;
            if (persona_id != undefined) {
                let personaAux = await persona.findOne({ where: { external_id: persona_id } });
                console.log(personaAux);
                if (personaAux) {
                    //data arreglo asociativo= es un direccionario = clave:valor
                    var data = {
                        //direccion: req.body.direccion,
                        id_persona: personaAux.id,
                    }
                    let transaction = await models.sequelize.transaction();
                    try {
                        await factura.create(data);
                        await transaction.commit();
                        res.json({ msg: "Se han creado la factura", code: 200 });
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
                    res.json({ msg: "La persona no se encuentra", code: 400 });
                }
            } else {
                res.status(400);
                res.json({ msg: "Faltan datos", code: 400 });
            }
        } else {
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400, errors: errors });
        }
    }

}
module.exports = FacturaController;