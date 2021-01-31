const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const Product = require('./app/controllers/ProductController')
const Home = require('./app/controllers/HomeController')
const Search = require('./app/controllers/SearchController')

// Rotas Públicas
routes.get('/', Home.index)
routes.get('/products/search', Search.index)                        // 

// Rotas para a Administração dos Produtos
routes.get('/products/create', Product.create)                      // Redireciona para o formulário de cadastro
routes.get('/products/:id', Product.show)                           // Exibe detalhes de um produto
routes.get('/products/:id/edit', Product.edit)                      // Redireciona para o formulário de edição
routes.post('/products', multer.array("photos", 6), Product.post)   // Recebe os dados do Form, verifica os arq. do campo "Photos" e cadastra
routes.put('/products', multer.array("photos", 6), Product.put)     // Recebe os dados do Form, verifica os arq. do campo "Photos" e atualiza
routes.delete('/products', Product.delete)                          // Deleta um produto

routes.get('/ads/create', function(req, res){
    return res.redirect('/products/create')
})

module.exports = routes