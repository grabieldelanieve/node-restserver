const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], // Valores permitidos
    message: '{VALUE} no es un rol valido' // Mensaje de error
};

let usuarioSchema = new Schema({ // Definiendo esquema
    // Campos que tendra nuestra tabla
    nombre: {
        // Restricciones
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contrasena es necesaria']
    },
    img: {
        type: String,
        required: [false, 'No es obligatoria']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this; // igual a lo que tenga en ese momento
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

//Exportando en modelo
//Usuario tendra todas las configuraciones de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);