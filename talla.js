const {MongoClient}= require('mongodb');
require('dotenv').config();

const URI = process.env.URI;

async function TallaCreateCollection(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Talla",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionTallas',
                    required:['idTalla','Talla'],
                    properties:{
                        idTalla:{
                            bsonType:'int'
                        },
                        Talla:{
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


async function PoblateTalla(){

    const client = new MongoClient(URI)

    try {
        await client.connect();
        const Datos = [];
        const Admin = {
            idTalla:1,
            Talla:"M"
        }
        const Empleado = {
            idTalla:2,
            Talla:"Xl"
        }
        Datos.push(Admin,Empleado)
        const Result= await client.db('SoftDCano').collection('Talla').insertMany(Datos)
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
async function DropTalla(){

    const client = new MongoClient(URI)

    try {
        const Result= await client.db('SoftDCano').dropCollection('Talla');
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
    
}
// DropTalla()
// TallaCreateCollection();
PoblateTalla()
