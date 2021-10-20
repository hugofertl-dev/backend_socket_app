
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    // Verificar autenticacion
    if (!valido) { return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado(uid);

    //Ingresar al usuario a una sala en particular
    //sala global utlizo io.emit, usuario individual client.id
    //para usar una sala idividual se utiliza join(??????) donde ??? es un
    //identificador unico para representar la sala voy a utilizar el id del usario de la base de datos
    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        console.log(payload);
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', (payload) => {
    //     console.log('recibio mensaje!!!!', payload);

    //     io.emit('mensaje', { admin: 'Nuevo Mensaje' });
    // })
});