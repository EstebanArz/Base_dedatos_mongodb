const {MongoClient}= require('mongodb');
const { fakerES_MX,faker } = require('@faker-js/faker');
require('dotenv').config();

const URI = process.env.URI;

async function ProductosCreateCollection(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Productos",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionProductos',
                    required:['idProducto','idTalla', 'idColor','idCategoria','referenciaProducto','nombreProductos','precioProducto', 'estadoProducto','cantidadProducto'],
                    properties:{
                        idProducto:{
                            bsonType:'int'
                        },
                        idTalla:{
                            bsonType: 'int'
                        },
                        idColor:{
                            bsonType: "int"
                        },
                        idCategoria:{
                            bsonType: "int"
                        },
                        referenciaProducto:{
                            bsonType: "string"
                        },
                        nombreProductos: {
                            bsonType: "string"
                        },
                        precioProducto:{
                            bsonType: "int"
                        },
                        estadoProducto: {
                            bsonType: "string"
                        },
                        fotoProducto: {
                            bsonType: "string"
                        },
                        cantidadProducto: {
                            bsonType: "int"
                        }
                    }
                }
            }
        })
        if (result){
            console.log("Base de datos creada correctamente");
        }else{
            console.log("No se ha creado la base de datos");
        }
    }catch(e){
        console.log(e);
    }finally{
        await Client.close();
    }
}


async function PoblateProductos(NumeroRegistros){

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const Datos = [];
        const Productos = await Client.db("SoftDCano").collection("Productos").find({}).toArray();
        const Colores = await Client.db("SoftDCano").collection("Color").find({}).project({idColor:true,_id:false}).toArray();
        const Tallas = await Client.db("SoftDCano").collection("Talla").find({}).project({idTalla:true,_id:false}).toArray();
        const Categorias = await Client.db("SoftDCano").collection("Categoria").find({}).project({idCategoria:true,_id:false}).toArray();
        for (let i=0; i<NumeroRegistros;i++){
            const DatosInsertar = {
                idProducto: Productos.length+i,
                idTalla: faker.helpers.arrayElement(Tallas).idTalla,
                idColor: faker.helpers.arrayElement(Colores).idColor,
                idCategoria: faker.helpers.arrayElement(Categorias).idCategoria,
                referenciaProducto: faker.string.alphanumeric({length:3}),
                nombreProductos: faker.helpers.arrayElement(["Blusa","Buzo","Boxer","Vestido de baño","Short","Camisilla","Pantalon","leggins","Falda Short","Pantalonetas", "Tops","Chalecos","Cinturillas","Duo Deportivo"]),
                precioProducto: faker.number.int({min:1000, max:100000}),
                estadoProducto: faker.helpers.arrayElement(["Activo","Inactivo"]),
                fotoProducto: faker.image.url(),
                cantidadProducto: faker.number.int({max:60})


            }
            Datos.push(DatosInsertar);
            console.log(`Se han insertado: ${Datos.length} datos`)
        }
        const Result= await Client.db('SoftDCano').collection('Productos').insertMany(Datos)
        
    }catch(e){
        console.log(e);
    }finally{
        await Client.close();
    }


}
// insertOne, insertMany, find, findOne, updateOne (con y sin upsert), updateMany (con y sin upsert), deleteOne, deleteMany, drop collection, drop Database y $lookup (al menos dos)

// Se realizaron al menos dos pipelines (cada uno con tres etapas)
// Se realizó un ejemplo de $limit, un ejemplo de $sort y un ejemplo de $unwind
// ProductosCreateCollection();
PoblateProductos(2000);
async function InsertarProducto(Producto) {

    const Client = new MongoClient(URI)

    try {
        await Client.connect();
        const Productos = await Client.db("SoftDCano").collection("Productos").find({}).toArray();
        const Colores = await Client.db("SoftDCano").collection("Color").find({}).project({idColor:true,_id:false}).toArray();
        const Tallas = await Client.db("SoftDCano").collection("Talla").find({}).project({idTalla:true,_id:false}).toArray();
        const Categorias = await Client.db("SoftDCano").collection("Categoria").find({}).project({idCategoria:true,_id:false}).toArray();
        if (Producto.idColor <= Colores.length && Producto.idTalla <= Tallas.length && Producto.idCategoria <= Categorias.length && Producto.idProducto > Productos.length  ){ 
                const Result = await Client.db('SoftDCano').collection('Productos').insertOne(Producto)
                console.log("Usuario registrado")
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
async function InsertarProductos(Productos) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Result = await Client.db('SoftDCano').collection('Productos').insertMany(Productos)
        console.log(`se registraron los datos`)
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// InsertarUsuarios([{},{}])
async function BuscarProducto(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").findOne(Busqueda);
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
async function BuscarProductos(Busqueda, Proyeccion, Organizacion, Limite, Salto) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").find(Busqueda).project(Proyeccion).sort(Organizacion).limit(Limite).skip(Salto).toArray();
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
async function ActualizarProducto(Busqueda, Actualizacion) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").findOne(Busqueda)
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Actualizando = await Client.db("SoftDCano").collection("Productos").updateOne(Busqueda, { $set: Actualizacion });
            const Actualizado = await Client.db("SoftDCano").collection("Productos").findOne(Actualizacion);
            if (Actualizado) {
                console.log(`se actualizaron los datos`)
                console.log(Actualizado)
            } else {
                console.log("No se encontro el Producto")
            }
        } else {
            console.log("No se encontro el Producto")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// ActualizarUsuario({}, {})
async function ActualizarProductos(Busqueda, Actualizacion) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").find(Busqueda).toArray
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Actualizando = await Client.db("SoftDCano").collection("Productos").updateMany(Busqueda, { $set: Actualizacion });
            const Actualizado = await Client.db("SoftDCano").collection("Productos").find(Actualizacion).toArray();
            if (Actualizado) {
                console.log(`se actualizaron los datos`)
                console.log(Actualizado)
            } else {
                console.log("No se encontro el Producto")
            }
        } else {
            console.log("No se encontro el Producto")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function EliminarProducto(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").findOne(Busqueda)
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Eliminado = await Client.db("SoftDCano").collection("Productos").deleteOne(Busqueda);
            if(Eliminado){
                console.log("Se elimino el Producto")
            }
        } else {
            console.log("No se encontro el Producto")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function EliminarProductos(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").find(Busqueda).toArray();
        if (Encontrado) {
            console.log(`se encontro los datos`)
            console.log(Encontrado)
            const Eliminado = await Client.db("SoftDCano").collection("Productos").deleteMany(Busqueda);
            if(Eliminado){
                console.log("Se eliminaron los Productos")
            }
        } else {
            console.log("No se encontro el Producto")
        }


    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
async function Productos() {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").aggregate([{ 
            $lookup:{
                from: "Categoria",
                localField: "idCategoria",
                foreignField: "idCategoria",
                as:"Categoria"
            }     
        },
        { 
            $lookup:{
                from: "Color",
                localField: "idColor",
                foreignField: "idColor",
                as:"Color"
            }     
        },
        { 
            $lookup:{
                from: "Talla",
                localField: "idTalla",
                foreignField: "idTalla",
                as:"Talla"
            }     
        },{
            $unwind:"$Color"
        },{
            $unwind:"$Talla"
        },{
            $unwind:"$Categoria"
        },{
            $project:{
                "_id":false,
                "Color._id":false,
                "Color.idColor":false,
                "Talla._id":false,
                "Talla.idTalla":false,
                "Categoria._id":false,
                "Categoria.idCategoria":false,
                "idColor":false,
                "idTalla":false,
                "idCategoria":false,
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
// Productos()
async function ProductosporCategoria() {
    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const Encontrado = await Client.db("SoftDCano").collection("Productos").aggregate([{ 
            $lookup:{
                from: "Categoria",
                localField: "idCategoria",
                foreignField: "idCategoria",
                as:"Categoria"
            }     
        },
        {
            $group:{
                _id: "$Categoria.nombreCategoria",
                nroProductos:{$sum:1}
            }
        },
        {
            $sort:{
                "nroProductos":-1
            }
        }
    ]
    ).toArray()
    console.log("Los usuarios por rol son:")
    console.log(Encontrado)
    } catch (e) {
        console.log(e);
    } finally {
        await Client.close();
    }

}
// ProductosporCategoria()
async function DropProductos(Busqueda) {

    const Client = new MongoClient(URI)

    try {

        await Client.connect();
        const drop = await Client.db("SoftDCano").dropCollection("Productos")
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