const express = require('express')
const routes = express.Router()

const Home = require('../app/controllers/HomeController')

const Product = require('./products')
const User = require('./users')
const Cart = require('./cart')

// Rotas Públicas
routes.get('/', Home.index)

routes.use('/products', Product)    // Coloca /products na frente das rotas do arquivo product.js
routes.use('/users', User)          // Coloca /users na fente das rotas do arquivo users.js

routes.use('/cart', Cart)           // Coloca /cart na fente das rotas do arquivo cart.js

//Alias
routes.get('/ads/create', function(req, res){
    return res.redirect('/products/create')
})

routes.get('/accounts', function(req, res){
    return res.redirect('/users/login')
})

module.exports = routes