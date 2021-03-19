const express = require('express')
const routes = express.Router()

const Session = require('../app/controllers/SessionController')
const User = require('../app/controllers/UserController')

const Validator = require('../app/validators/user')

// // Rotas para Login / Logout
// routes.get('/login', Session.loginForm)
// routes.post('/login', Session.login)
// routes.post('/logout', Session.logout)

// // Rotas para Reset da Senha
// routes.get('/forgot-password', Session.forgotForm)
// routes.get('/password-reset', Session.resetForm)
// routes.post('/forgot-password', Session.forgot)
// routes.post('/password-reset', Session.reset)

// // Rotas para Administração dos Usuários
routes.get('/register', User.registerForm)
routes.post('/register', Validator.post, User.post)

routes.get('/', Validator.show, User.show)
routes.put('/', User.update)
// routes.delete('/', User.delete)

module.exports = routes