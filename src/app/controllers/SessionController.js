const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {

    loginForm(req, res){

        try {

            return res.render("session/login")
            
        } catch (err) {
            console.error(err)
        }

    },

    login(req,res){

        try {

            req.session.userId = req.user.id

            return res.redirect("/users")
            
        } catch (err) {
            console.error(err)
        }

    },

    logout(req, res){

        try {

            req.session.destroy()
            return res.redirect("/")
            
        } catch (err) {
            console.error(err)
        }
    },

    forgotForm(req, res){

        try {

            return res.render("session/forgot-password")
            
        } catch (err) {
            console.error(err)
        }

    },

    async forgot(req, res){

        const user = req.user

        try {

            // Cria um token de recuperação para o usuario
            const token = crypto.randomBytes(20).toString("hex")

            // Cria a experição do Token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // Envia um email com o link de recuperação
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de Senha',
                html: 
                `
                    <h2>Perdeu a chave?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                    <p>
                        <a href="http://localhost:3000/users/password-reset?token=${ token }" target="_blank">
                            Recuperar senha
                        </a>
                    </p>
                `
            })

            //  Avisa o usuário que o email de recuperação foi enviado
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha"
            })
            
        } catch (err) {
            console.error(err)
            return res.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente mais tarde"
            })
        }

    },

    resetForm(req, res){

        try {

            return res.render("session/password-reset", { token: req.query.token })
            
        } catch (err) {
            console.error(err)
        }

    },

    async reset(req, res){

        const user = req.user
        const { password, token } = req.body

        try {

            // Cria uma nova senha
            const newPassword = await hash(password, 8)

            // Atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // Confirma a atualização
            return res.render("session/login", {
                user: req.body,
                success: "Senha Atualizada!"
            })

            
        } catch (err) {
            console.error(err)
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente mais tarde"
            })
        }

    }

}