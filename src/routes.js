const express = require('express')
const routes = express.Router()
const Product = require('./app/controllers/productController')

routes.get('/', function(req, res){
    return res.render("layout.njk")
})

routes.get('/products/create', Product.create)      // Redireciona para o formulário de novo produto
routes.get('/products/:id/edit', Product.edit)      // Redireciona para o formulário de edição de produto
routes.post('/products', Product.post)              // Cadastra um novo produto
routes.put('/products', Product.put)                // Atualiza um produto
routes.delete('/products', Product.delete)          // Deleta um produto

routes.get('/ads/create', function(req, res){
    return res.redirect('/products/create')
})

module.exports = routes