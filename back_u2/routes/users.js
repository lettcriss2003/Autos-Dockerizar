var express = require('express');
var router = express.Router();

const rolC = require('../app/controls/RolController');
let rolControl = new rolC();

const personaC = require('../app/controls/PersonaController');
let personaControl = new personaC();

const cuentaC = require('../app/controls/CuentaController');
let cuentaControl = new cuentaC();

const marcaC = require('../app/controls/MarcaController');
let marcaControl = new marcaC();

const autoC = require('../app/controls/AutoController');
let autoControl = new autoC();

const facturaC = require('../app/controls/FacturaController');
let facturaControl = new facturaC();

const detalleC = require('../app/controls/DetalleController');
let detalleControl = new detalleC();
let jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//MIDDLEWARE
const auth = function middleware(req, res, next){
  //AUTENTICACION
  const token = req.headers['news-token'];
  if(token === undefined){
    res.status(400);
    res.json({ msg: "ERROR", tag: "Falta token", code: 400 });
  }else{
    require('dotenv').config();
    const key = process.env.KEY_TNCP;
    jwt.verify(token, key, async(error, decoded) => {
      if(error){
        res.status(400);
        res.json({ msg: "ERROR", tag: "TOKEN NO VALIDO O EXPIRADO", code: 400 });
      }else{
        console.log(decoded.external);
        const models = require('../app/models');
        const cuenta = models.cuenta;
        const aux = await cuenta.findOne({
          where: {external_id : decoded.external}
        });
        if(aux === null){
          res.status(400);
        res.json({ msg: "ERROR", tag: "TOKEN NO VALIDO", code: 400 });
        }else{
          next();
        }
      }
    });
    
  }
}

//CONTROLADOR ROL
router.get('/admin/rol', rolControl.listar);
router.post('/admin/rol/save', rolControl.guardar);

//CONTROLADOR PERSONAS
router.get('/listar/personas', personaControl.listar);
router.get('/obtener/persona/:external', personaControl.obtener);
router.get('/listarPorRol/:external', personaControl.listar_por_rol);
router.post('/registrar/persona', personaControl.guardar);
router.post('/editar/persona', personaControl.modificar);

//INICIO SESION
router.post('/inicio', cuentaControl.sesion);

//CONTROLADOR MARCAS
router.post('/registrar/marca',marcaControl.guardar);
router.get('/listar/marcas', marcaControl.listar);


//CONTROLADOR DE AUTOS
router.post('/registrar/auto', auth,autoControl.guardar);
router.post('/modificar/auto', auth, autoControl.modificar);
router.post('/foto/auto', auth,autoControl.modificarFoto);
router.get('/listar/autos', auth,autoControl.listar);
router.get('/listar/autos/vendidos', auth,autoControl.listarVendidos);
router.get('/listar/autos/disponibles', auth,autoControl.listarDisponibles);


//CONTROLADOR FACTURA

router.get('/listar/facturas', auth, facturaControl.listar);
router.post('/crear/factura', facturaControl.crearFactura);
router.post('/facturar', facturaControl.facturar);

//CONTROLADOR DETALLE

router.post('/registrar/detalle', detalleControl.guardar);

module.exports = router;