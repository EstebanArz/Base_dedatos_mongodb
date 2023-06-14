const {MongoClient}= require('mongodb');
const { fakerES_MX } = require('@faker-js/faker');

require('dotenv').config();

const URI = process.env.URI;

async function ColorCreateCollection(){
    const Client = new MongoClient(URI);

    try{
        await Client.connect();
        const result = await Client.db('SoftDCano').createCollection("Color",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionColores',
                    required:['idColor','color'],
                    properties:{
                        idColor:{
                            bsonType:'int'
                        },
                        color:{
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


async function PoblateColor(NumeroRegistros){

    const client = new MongoClient(URI)

    try {
        await client.connect();
        const consult = await client.db("SoftDCano").collection("Color").find({}).toArray();
        const Datos = [];
        for (let i=1; i<=NumeroRegistros;i++){
            const DatosInsertar = {

                idColor: consult.length+i,
                color: fakerES_MX.color.human()
            }
            Datos.push(DatosInsertar);
            console.log(`Se han insertado: ${Datos.length} datos`)
        }
        const Result= await client.db('SoftDCano').collection('Color').insertMany(Datos)
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }


}
// ColorCreateCollection();
PoblateColor(2000)
