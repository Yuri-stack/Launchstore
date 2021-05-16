const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const Search = require('../app/controllers/SearchController')
const Product = require('../app/controllers/ProductController')

const { onlyUsers } = require('../app/middlewares/session')
const Validator = require('../app/validators/products')

// Rota para Pesquisa
routes.get('/search', Search.index)

// Rotas para a Administração dos Produtos
routes.get('/create', onlyUsers, Product.create)            // Redireciona para o formulário de cadastro
routes.get('/:id', Product.show)                            // Exibe detalhes de um produto
routes.get('/:id/edit', onlyUsers, Product.edit)            // Redireciona para o formulário de edição

// Recebe os dados do Form, verifica os arq. do campo "Photos" e cadastra
routes.post('/', onlyUsers, multer.array("photos", 6), Validator.post, Product.post)

// Recebe os dados do Form, verifica os arq. do campo "Photos" e atualiza
routes.put('/', onlyUsers, multer.array("photos", 6), Validator.put, Product.put)  

// Deleta um produto
routes.delete('/', onlyUsers, Product.delete)    
                      
module.exports = routes