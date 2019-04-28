require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( { extended: false }))

app.use(bodyParser.json())



//Obtener 
app.get('/usuario', function (req, res) {
  res.json('GET usuario');
});

//Crear
app.post('/usuario', function (req, res) {
  let body = req.body;
  if (body.nombre === undefined){
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario'
    })
  } else {
    res.json({
      body
    });
  }
});

//Put
app.put('/usuario/:id', function (req, res) {

  let id = req.params.id;

  res.json({
    id
  });
});

//Delete
app.delete('/usuario', function (req, res) {
  res.json('DELETE usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});