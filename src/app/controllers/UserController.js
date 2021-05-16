const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')
const { formatCpfCnpj, formatCep } = require('../../lib/utils')

const User = require('../models/User')
const Product = require('../models/Product')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
    registerForm(req, res){
        return res.render("user/register")
    },

    async show(req, res){

        try {
            const { user } = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render("user/index", { user })
        } catch (error) {
            console.error(error);
        }
    }, 

    async post(req, res){

        try {
            let { name, email, password, cpf_cnpj, cep, address } = req.body

            // Criptografar Senha com HASH
            password = await hash(password, 8)

            // Retirando caracteres diferentes de números 
            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            const userId = await User.create({
                name, email, password, cpf_cnpj, cep, address
            })

            req.session.userId = userId

            return res.redirect('/users')
            
        } catch (error) {
            console.error(error)
        }
    },

    async update(req, res){

        try {
            const { user } = req

            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, { 
                name, email, cpf_cnpj, cep, address
            })

            return res.render("user/index", {
                user: req.body,
                success: "Conta atualizada"
            })
            
        } catch (error) {
            console.error(error)
            return res.render("user/index", {
                error: "Ocorreu um erro, tente mais tarde"
            })
        }
    },

    async delete(req, res){

        try {
            // Pega os Produtos
            const products = await Product.findAll({ where: { user_id: req.body.id } })
        
            // Pega as imagens dos Produtos
            const allFilesPromise = products.map(product =>
                Product.files(product.id)
            )

            let promiseResults = await Promise.all(allFilesPromise)

            // Remove o Usuário
            await User.delete(req.body.id)
            req.session.destroy()
        
            // Remove as imagens da Public
            promiseResults.map(files => {
                files.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (error) {
                        console.log(error)
                    }
                })
            })

            return res.render("session/login", {
                success: "Conta apagada com sucesso"
            })
            
        } catch (error) {
            console.error(error)
            return res.render("user/index", {
                user: req.body,
                error: "Ocorreu um erro ao apagar sua conta, tente mais tarde"
            })
        }
    },

    async ads(req, res){

        const products = await LoadProductService.load('products', {
            where: { user_id: req.session.userId }
        })

        return res.render("user/ads", { products })
    }
}