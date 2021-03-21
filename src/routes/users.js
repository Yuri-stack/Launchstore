const express = require('express')
const routes = express.Router()

const Session = require('../app/controllers/SessionController')
const User = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

// // Rotas para Login / Logout
routes.get('/login', Session.loginForm)
routes.post('/login', SessionValidator.login, Session.login)
routes.post('/logout', Session.logout)

// // Rotas para Reset da Senha
// routes.get('/forgot-password', Session.forgotForm)
// routes.get('/password-reset', Session.resetForm)
// routes.post('/forgot-password', Session.forgot)
// routes.post('/password-reset', Session.reset)

// // Rotas para Administração dos Usuários
routes.get('/register', User.registerForm)
routes.post('/register', UserValidator.post, User.post)

routes.get('/', UserValidator.show, User.show)
routes.put('/', UserValidator.update, User.update)
// routes.delete('/', User.delete)

module.exports = routes