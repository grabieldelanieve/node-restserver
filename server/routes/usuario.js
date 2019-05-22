const express = require('express');


const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion')

const app = express();

//Obtener 
app.get('/usuario', verificaToken, (req, res) => {


    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        })
});

//Crear
app.post('/usuario', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({ //instancia 
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //hash de forma sincrona
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null; //Para que se vea null

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

//Put
app.put('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']); //Solo estas se pueden actualizar (pick)

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { // Validaciones

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            OK: true,
            usuario: usuarioDB
        });

    })

});

//Delete
app.delete('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {
    // res.json('DELETE usuario');

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };


    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     };

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // });

});


module.exports = app;