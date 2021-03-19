//Primero iniciar el mongodb
const express = require('express');
const mongoose = require('mongoose');
const app = express();
                            //user:pwd@servidor:puerto/name_bd 
mongoose.connect('mongodb://dev:dev@localhost:27017/todos',{useNewUrlParser:true,useUnifiedTopology:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('Conexion a la BD');    
});
connection.on('error',(err)=>{
    console.log('Error Conexion a la BD',err);    
});

app.get('/',(req,res)=>{
    res.json({
        response:'success ,ok'
    })
});
app.listen(3000,()=>{
    console.log('Servidor Iniciado');    
})
