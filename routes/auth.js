/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middelwares/validar-campos');
const { validarJWT } = require('../middelwares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Falta determinar el Email').not().isEmpty(),
    check('email', 'El Email es Invalido').isEmail(),
    check('password', 'Falta determinar la Contraseña').not().isEmpty(),
    validarCampos
], crearUsuario);


router.post('/', [
    check('email', 'Falta determinar el Email').not().isEmpty(),
    check('email', 'El Email es Invalido').isEmail(),
    check('password', 'Falta determinar la Contraseña').not().isEmpty(),
    validarCampos
], login);

router.get('/renew', validarJWT, renewToken);

module.exports = router;