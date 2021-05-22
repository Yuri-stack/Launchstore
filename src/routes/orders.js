const express = require('express')
const routes = express.Router()

const Order = require('../app/controllers/OrderController')

const { onlyUsers } = require('../app/middlewares/session')

routes.post('/', Order.post)


module.exports = routes