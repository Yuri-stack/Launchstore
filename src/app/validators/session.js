const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next){

    const { email, password } = req.body

    try {

        const user = await User.findOne({ where: { email } })

        if(!user) return res.render("session/login", { 
            user: req.body,
            error: "Usuário não cadastrado!"
        })
    
        const passed = await compare(password, user.password)
        
        if(!passed){
            return res.render("session/login", {
                user: req.body,
                error: "Senha incorreta"
            })
        }
    
        req.user = user
    
        next()

    } catch (err) {
        console.error(err)
    }

}

async function forgot(req, res, next){

    const { email } = req.body

    try {

        let user = await User.findOne({ where: { email } })

        if(!user) return res.render("session/forgot-password", { 
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
        
    } catch (err) {
        console.error(err)
    }

}

async function reset(req, res, next){

    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if(!user) return res.render("session/password-reset", { 
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    if(password != passwordRepeat)
        return res.render('session/password-reset', { 
            user: req.body,
            token,
            error: 'As senhas não conferem'
        })

    // Verifica se o Token confere
    if(token != user.reset_token)
        return res.render('session/password-reset', { 
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação'
        })

    // Verifica se o Token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires)
        return res.render('session/password-reset', { 
            user: req.body,
            token,
            error: 'Token expirado! Solicite uma nova recuperação'
        })

    req.user = user

    next()

}

module.exports = { login, forgot, reset }