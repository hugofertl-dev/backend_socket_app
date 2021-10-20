//Aca importo el paquete Express
const express = require('express');

//Aca importo la opcion de manejar carpetas (no se requiere de ningun paquete en especial)
const path = require('path');

//Lo que hago aca es leer las variables de entorno que tengo definidas en mi raiz en 
//mi archivo .env
require('dotenv').config();

//DB Config
require('./database/config').dbConnection();


//Aca inicializo la App para poder utilizar y escuchar peticiones
const app = express();

//Lectura y parseo del body
app.use(express.json());

//Creo el Server Node
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);  //aca vinvulo el socket.io con el server creado arriba
require('./sockets/socket');


//Path público /Carpera publica
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//Mis Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log('Servidor corriendo en el puerto!!!', process.env.PORT);
});


