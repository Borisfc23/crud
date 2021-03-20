//Primero iniciar el mongodb
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());//Middleware de body parse para la obtencion de datos de html
app.use(express.urlencoded({extended: true}));//Middleware de body-parse
app.use(express.static('./public'));//Automaticamente lo toma como el main

//Conexiona mongodb        //user:pwd@servidor:puerto/name_bd 
mongoose.connect('mongodb://dev:dev@localhost:27017/todos',{useNewUrlParser:true,useUnifiedTopology:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('Conexion a la BD');    
});
connection.on('error',(err)=>{
    console.log('Error Conexion a la BD',err);    
});
//modelo
const Todo = mongoose.model('Todo',{text: String, completed: Boolean});

app.post('/add',(req,res)=>{//Aqui hago una consulta al body del index con name text
    const registro = new Todo({text: req.body.text, completed: false});    
    //save() trabaja con promesas
    registro.save()//
        .then(doc =>{ 
            console.log('Datos insertado correctamente...', doc);
            res.json({response:'success'});
            // res.redirect('/');//Te redirecciona al indice principal                          
        }).catch(err =>{
            console.log('Error al insertar...',err);
            res.status(400).json({response: 'failed'});//Error que se mostrara en el Fronted
        })
});

//En esta ruta obtendremos todos los elementos de la base de datos
app.get('/getall',(req,res)=>{
    Todo.find({},'_id text completed')//Puedes hacer una busqueda dependiendo de la propiedad
        .then(doc =>{
            res.json({
                response: 'success',
                data: doc
            });
        })
        .catch(err =>{
            console.log('Error en la busqueda...',err.message);
            res.status(400).json({response: 'failed'});//Error que se mostrara en el Fronted
        });
});

//En esta ruta se actualizaran los datos pasando 2 parametros el id y estado
app.get('/complete/:id/:status',(req,res)=>{
    const id = req.params.id; //El params devuelve un valor string
    const status = req.params.status = 'true'; //Asi se convierte a boolean
                            //condicion //que parte se va actualizar
    Todo.findByIdAndUpdate({_id: id},{$set: {completed: status}},{useFindAndModify: false})
        .then(doc=>{
            res.json({response:'success'});
        })
        .catch(err=>{
            console.log('Error al actualizar dato',err.message);
            res.status(400).json({response: 'failed'});//Error que se mostrara en el Fronted
        });
});

app.get('/delete/:id',(req,res)=>{
    const id = req.params.id;
    Todo.findByIdAndDelete({_id:id})
        .then(doc=>{
            // res.json({response:'success'});
            res.redirect('/');
        })
        .catch(err=>{
            console.log('Error al borrar el registro',err);
            res.status(400).json({response:'failed'});
        });
});

app.listen(3000,()=>{
    console.log('Servidor Iniciado');    
})
