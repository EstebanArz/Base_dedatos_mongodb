const {MongoClient}= require('mongodb');
require('dotenv').config();

const URI = process.env.URI;

async function CategoriaCreateCollection(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Categoria",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionCategorias',
                    required:['idCategoria','Categoria'],
                    properties:{
                        idCategoria:{
                            bsonType:'int'
                        },
                        Categoria:{
                            bsonType: 'string'
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


async function PoblateCategoria(){

    const client = new MongoClient(URI)

    try {
        await client.connect();
        const Datos = [];
        const Admin = {
            idCategoria:1,
            Categoria:"Camisas"
        }
        const Empleado = {
            idCategoria:2,
            Categoria:"Pantalones"
        }
        Datos.push(Admin,Empleado)
        const Result= await client.db('SoftDCano').collection('Categoria').insertMany(Datos)
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
async function DropCategoria(){

    const client = new MongoClient(URI)

    try {
        const Result= await client.db('SoftDCano').dropCollection('Categoria');
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
// DropCategoria()
// CategoriaCreateCollection();
PoblateCategoria()

