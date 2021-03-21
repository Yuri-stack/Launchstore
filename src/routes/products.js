const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { onlyUsers } = require('../app/middlewares/session')

const Search = require('../app/controllers/SearchController')
const Product = require('../app/controllers/ProductController')

// Rota para Pesquisa
routes.get('/products/search', Search.index)

// Rotas para a Administração dos Produtos
routes.get('/create', onlyUsers, Product.create)            // Redireciona para o formulário de cadastro
routes.get('/:id', Product.show)                            // Exibe detalhes de um produto
routes.get('/:id/edit', Product.edit)                       // Redireciona para o formulário de edição

routes.post('/', multer.array("photos", 6), Product.post)   // Recebe os dados do Form, verifica os arq. do campo "Photos" e cadastra
routes.put('/', multer.array("photos", 6), Product.put)     // Recebe os dados do Form, verifica os arq. do campo "Photos" e atualiza
routes.delete('/', Product.delete)                          // Deleta um produto

module.exports = routes