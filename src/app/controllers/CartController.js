const Cart = require('../../lib/cart')

const LoadProductsService = require('../services/LoadProductService')

module.exports = {
    async index(req, res){
        try {

            let { cart } = req.session

            // Gerenciador de Carrinho
            cart = Cart.init(cart)

            return res.render("cart/index", { cart })
        } catch (err) {
            console.log(err)
        }
    },

    async addOne(req,res){
        try {

            // Pegar o Id do produto e o Produto
            const { id } = req.params
            const product = await LoadProductsService.load('product', {where: { id }})

            // Pegar o Carrinho da Sessão
            let { cart } = req.session

            // Add o Produto ao Carrinho (Usando o Gerenciador)
            cart = Cart.init(cart).addOne(product)

            // Atualiza o Carrinho da Sessão
            req.session.cart = cart

            // Redirecionar o Usuário para a tela do Carrinho
            return res.redirect('/cart')

        } catch (err) {
            console.log(err)
        }
    },

    async removeOne(req,res){
        try {

            // Pegar o Id do produto
            const { id } = req.params

            // Pegar o Carrinho da Sessão
            let { cart } = req.session

            // Se não tiver, retornar
            if(!cart) return res.redirect('/cart')

            // Iniciar o Carrinho (Gerenciador de Carrinho) e Remover
            cart = Cart.init(cart).removeOne(id)

            // Atualizar o Carrinho da Sessão removendo 1 Item
            req.session.cart = cart

            // Redirecionar para a pag. Cart
            return res.redirect('/cart')
            
        } catch (err) {
            console.log(err)
        }
    }
}