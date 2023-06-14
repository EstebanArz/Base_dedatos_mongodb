const {MongoClient}= require('mongodb');
require('dotenv').config();

const URI = process.env.URI;

async function RolCreateCollection(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("NombreRol",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionRole',
                    required:['idRol','NombreRol'],
                    properties:{
                        idRol:{
                            bsonType:'int'
                        },
                        NombreRol:{
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


async function PoblateRol(){

    const client = new MongoClient(URI)

    try {
        await client.connect();
        const Datos = [];
        const Admin = {
            idRol:1,
            NombreRol:"Camisas"
        }
        const Empleado = {
            idRol:2,
            NombreRol:"Pantalones"
        }
        Datos.push(Admin,Empleado)
        const Result= await client.db('SoftDCano').collection('NombreRol').insertMany(Datos)
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
async function DropRol(){

    const client = new MongoClient(URI)

    try {
        const Result= await client.db('SoftDCano').dropCollection('NombreRol');
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
// DropRol()
// RolCreateCollection();
PoblateRol()
