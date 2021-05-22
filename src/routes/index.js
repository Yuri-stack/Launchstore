const express = require('express')
const routes = express.Router()

const Home = require('../app/controllers/HomeController')

const Product = require('./products')
const User = require('./users')
const Cart = require('./cart')
const Orders = require('./orders')

// Rotas Públicas
routes.get('/', Home.index)

routes.use('/products', Product)    // Coloca /products na frente das rotas do arquivo product.js
routes.use('/users', User)          // Coloca /users na frente das rotas do arquivo users.js

routes.use('/cart', Cart)               // Coloca /cart na frente das rotas do arquivo cart.js
routes.use('/orders', Orders)           // Coloca /orders na frente das rotas do arquivo orders.js

//Alias
routes.get('/ads/create', function(req, res){
    return res.redirect('/products/create')
})

routes.get('/accounts', function(req, res){
    return res.redirect('/users/login')
})

module.exports = routes