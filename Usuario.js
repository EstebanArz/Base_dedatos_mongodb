const { MongoClient } = require('mongodb');
const { fakerES_MX, faker } = require('@faker-js/faker');

require('dotenv').config();

const URI = process.env.URI;

async function UsuarioCreateCollection() {
    const Client = new MongoClient(URI);

    try {
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Usuario", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    title: 'validacionUsuario',
                    required: ['idUsuario', 'idRol', 'nombreUsuario', 'apellidoUsuario', 'Usuario', 'celularUsuario', 'contrasenaUsuario', 'estadoUsuario'],
                    properties: {
                        idUsuario: {
                            bsonType: 'int'
                        },
                        idRol: {
                            bsonType: 'int'
                        },
                        nombreUsuario: {
                            bsonType: "string"
                        },
                        apellidoUsuario: {
                            bsonType: "string"
                        },
                        Usuario: {
                            bsonType: "string"
                        },
                        celularUsuario: {
                            bsonType: "int"
                        },
                        contrasenaUsuario: {
                            bsonType: "string"
                        },
                        emailUsuario: {
                            bsonType: "string"
                        },
                        estadoUsuario: {
                            bsonType: "string"
                        },
                        fotoUsuario: {
                            bsonType: "string"
                        }
                    }
                }
            }
        })
        if (result) {
            console.log("Base de datos creada correctamente");
        } else {
            console.log("No se ha creado la base de datos");
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}
// BasedeDatos();

async function PoblateUsuarios(NumeroRegistros) {

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const Roles = await Client.db("SoftDCano").collection("Rol").find({}).project({ idRol: true, _id: false }).toArray();
        const Datos = [];
        for (let i = 0; i < NumeroRegistros; i++) {
            var nombreUsuario = faker.person.firstName(),
                apellidoUsuario = faker.person.lastName();
            const DatosInsertar = {

                idUsuario: faker.number.int({ min: 100000000, max: 999999999 }),
                idRol: faker.helpers.arrayElement(Roles).idRol,
                nombreUsuario: nombreUsuario,
                apellidoUsuario: apellidoUsuario,
                Usuario: nombreUsuario + apellidoUsuario,
                celularUsuario: faker.number.int({ min: 100000000, max: 999999999 }),
                contrasenaUsuario: faker.internet.password(),
                emailUsuario: faker.internet.email({ firstName: nombreUsuario, lastName: apellidoUsuario }),
                estadoUsuario: faker.helpers.arrayElement(["Activo", "Inactivo"]),


            }
            Datos.push(DatosInsertar);
            console.log(`Se han insertado: ${Datos.length} datos`)
        }
        const Result = await Client.db('SoftDCano').collection('Usuario').insertMany(Datos)

    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }
}
// UsuarioCreateCollection();
PoblateUsuarios(20000);

async function InsertarUsuario(Usuario) {

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const Roles = await Client.db("SoftDCano").collection("Rol").find({}).project({ idRol: true, _id: false }).toArray();
        if (Usuario.idRol <= Roles.length) {
            if (Usuario.Usuario == "") {
                Usuario.Usuario = Usuario.nombreUsuario + Usuario.apellidoUsuario;
                const Result = await Client.db('SoftDCano').collection('Usuario').insertOne(Usuario)
                console.log("Usuario registrado")
            } else {
                const Result = await Client.db('SoftDCano').collection('Usuario').insertOne(Usuario)
                console.log("Usuario registrado")
            }
        }
        else {
            console.log("Datos invalidos")
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// InsertarUsuario({})
async function InsertarUsuarios(Usuarios) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Roles = await Client.db("SoftDCano").collection("Rol").find({}).project({ idRol: true, _id: false }).toArray();
        const Result = await Client.db('SoftDCano').collection('Usuario').insertMany(Usuarios)
        console.log(`se registraron los datos`)
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// InsertarUsuarios([{},{}])
async function BuscarUsuario(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").findOne(Busqueda);
        if (Encontrado) {
            console.log(`se encontraron los datos`)
            console.log(Encontrado)
        } else {
            console.log("No se encontro el usuario")
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// BuscarUsuario({})
async function BuscarUsuarios(Busqueda, Proyeccion, Organizacion, Limite, Salto) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").find(Busqueda).project(Proyeccion).sort(Organizacion).limit(Limite).skip(Salto).toArray();
        if (Encontrado) {
            console.log(`se encontraron los datos`)
            console.log(Encontrado)
        } else {
            console.log("No se encontro el usuario")
        }
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// BuscarUsuarios({},{},{},{},{})
async function ActualizarUsuario(Busqueda, Actualizacion) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").findOne(Busqueda)
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Actualizando = await Client.db("SoftDCano").collection("Usuario").updateOne(Busqueda, { $set: Actualizacion });
            const Actualizado = await Client.db("SoftDCano").collection("Usuario").findOne(Actualizacion);
            if (Actualizado) {
                console.log(`se actualizaron los datos`)
                console.log(Actualizado)
            } else {
                console.log("No se encontro el usuario")
            }
        } else {
            console.log("No se encontro el usuario")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// ActualizarUsuario({}, {})
async function ActualizarUsuarios(Busqueda, Actualizacion) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").find(Busqueda).toArray
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Actualizando = await Client.db("SoftDCano").collection("Usuario").updateMany(Busqueda, { $set: Actualizacion });
            const Actualizado = await Client.db("SoftDCano").collection("Usuario").find(Actualizacion).toArray();
            if (Actualizado) {
                console.log(`se actualizaron los datos`)
                console.log(Actualizado)
            } else {
                console.log("No se encontro el usuario")
            }
        } else {
            console.log("No se encontro el usuario")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function EliminarUsuario(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").findOne(Busqueda)
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Eliminado = await Client.db("SoftDCano").collection("Usuario").deleteOne(Busqueda);
            if(Eliminado){
                console.log("Se elimino el usuario")
            }
        } else {
            console.log("No se encontro el usuario")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function EliminarUsuarios(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").find(Busqueda).toArray();
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Eliminado = await Client.db("SoftDCano").collection("Usuario").deleteMany(Busqueda);
            if(Eliminado){
                console.log("Se eliminaron los usuarios")
            }
        } else {
            console.log("No se encontro el usuario")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function UsuariosPorRol() {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").aggregate([{ 
            $lookup:{
                from: "Rol",
                localField: "idRol",
                foreignField: "idRol",
                as:"Rol"
            }     
        },
        {
            $group:{
                _id: "$Rol.NombreRol",
                nroUsuarios:{$sum:1}
            }
        },
        {
            $sort:{
                "nroUsuarios":-1
            }
        }
    ]).toArray()
    console.log("Los usuarios por rol son:")
    console.log(Encontrado)
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// UsuariosPorRol()
async function UsuariosyRol() {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Usuario").aggregate([{ 
            $lookup:{
                from: "Rol",
                localField: "idRol",
                foreignField: "idRol",
                as:"Rol"
            }     
        },
        {
            $unwind:"$Rol"
        },
        {
            $sort:{
                "nombreUsuario":1
            }
        },
        {
            $project:{
                "_id":false,
                "Rol._id":false,
                "Rol.idRol":false,
            }
        }
    ]).toArray()
    console.log("Los usuarios por rol son:")
    console.log(Encontrado)
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// UsuariosyRol()
async function DropUsuario(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const drop = await Client.db("SoftDCano").dropCollection("Usuario")
        if (drop) {
            console.log(`se la coleccion usuarios fue eliminada`)
        } else {
            console.log("No se ha podido eliminar la coleccion")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}