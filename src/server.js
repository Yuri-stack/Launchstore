const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')   //carregamos a lib. method-override para poder sobreescrever os metodos POST e GET 
const session = require('./config/session')

const server = express()

server.use(session)                                 //iniciando as config. da Sessão
server.use(express.urlencoded({ extended: true }))  //config que permite o req.body funcionar
server.use(express.static('public'))                //configurando para o express procurar CSS e JS na pasta Public
server.use(methodOverride('_method'))               //essa parte identifica nas action´s dos form a query String: _method, para poder sobreescrever POST e GET
server.use(routes)                                  //config para poder usar o arquivo de rotas

server.set("view engine", "njk")                    //config que diz qual engine estamos usando

nunjucks.configure('src/app/views', {
    express:server,                      
    autoescape: false,                   
    noCache: true                        
})

server.listen(5000, function(){
    console.log("The Server is online, my friend!")
})