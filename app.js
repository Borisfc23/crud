const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.get('/',(req,res)=>{
    res.send("ok,ya")
});
app.listen(3000,()=>{
    console.log('Servidor Iniciado');    
})
