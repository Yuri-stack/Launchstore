const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {

    loginForm(req, res){

        try {

            return res.render("session/login")
            
        } catch (error) {
            console.log(error)
        }

    },

    login(req,res){

        try {

            req.session.userId = req.user.id

            return res.redirect("/users")
            
        } catch (error) {
            console.log(error)
        }

    },

    logout(req, res){

        try {

            req.session.destroy()
            return res.redirect("/")
            
        } catch (error) {
            console.log(error)
        }
    },

    forgotForm(req, res){

        try {

            return res.render("session/forgot-password")
            
        } catch (error) {
            console.log(error)
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
            
        } catch (error) {
            console.log(error)
        }

    },

    reset(req, res){}

}