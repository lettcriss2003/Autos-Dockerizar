'use strict';
const {validationResult} = require('express-validator');
var models= require('../models/');
var marca=models.marca;
class MarcaController{

    async listar(req,res){
        var listar= await marca.findAll({
            attributes:['nombre','modelo','pais','external_id','estado']
        });
        res.json({msg:'OK!',code:200,info:listar});
    }

    async numMarca(req, res) {
        const contar = await marca.count();
        res.json({ msg: 'OK!', code: 200, info: contar });
    }

    async guardar(req, res) {
        let errors = validationResult(req);
        if(req.body.hasOwnProperty('nombre') &&
        req.body.hasOwnProperty('pais') &&
        req.body.hasOwnProperty('modelo'))
        {
            if (errors.isEmpty()) {
                //data arreglo asociativo= es un direccionario = clave:valor
                var data = {
                    nombre: req.body.nombre,
                    pais: req.body.pais,
                    modelo: req.body.modelo
                }
                try {
                    await marca.create(data);
                    res.json({ msg: "Se han registrado los datos", code: 200 });
                } catch (error) {
                    if (error.errors && error.errors[0].message) {
                        res.json({ msg: error.errors[0].message, code: 200 });
                    } else {
                        res.json({ msg: error.message, code: 200 });
                    }
                }           
            } else {
                res.status(400);
                res.json({ msg: "Datos faltantes", code: 400, errors: errors });
            }
        }else{
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400, errors: errors });
        }
        
    }
}
module.exports = MarcaController;