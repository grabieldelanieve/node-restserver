// Configuracion
require('./config/config');

//Require necesarios - librerias
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Iniciamos el express
const app = express();

//Configuracion del bdoy parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuracion global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});