const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El Correo ya esta registrado'
            })
        }


        const usuario = Usuario(req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }

};

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {

        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Mail no encontado'
            })
        }

        //Validar Password
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La Contraseña es Invalida'
            })
        }

        //Como paso todo bien es decir el usuario existe y la contraseña es correcta
        //genero el JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })

    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuarioDB = await Usuario.findById({ _id: uid });


    res.json({
        ok: true,
        usuario: usuarioDB,
        token: token
    })
}

module.exports = {
    crearUsuario, login, renewToken
}