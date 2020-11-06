const express = require('express')
const routes = express.Router()
const Product = require('./app/controllers/productController')

routes.get('/', function(req, res){
    return res.render("layout.njk")
})

routes.get('/products/create', Product.create)
routes.post('/products', Product.post)

routes.get('/ads/create', function(req, res){
    return res.redirect('/products/create')
})

module.exports = routes