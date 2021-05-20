const express = require('express')
const routes = express.Router()

const Cart = require('../app/controllers/CartController')

// Rotas para Login / Logout
routes.get('/', Cart.index)
routes.post('/:id/add-one', Cart.addOne)
routes.post('/:id/remove-one', Cart.removeOne)

module.exports = routes