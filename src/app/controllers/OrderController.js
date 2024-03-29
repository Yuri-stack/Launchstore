const User = require('../models/User')
const Order = require('../models/Order')

const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')

const Cart = require('../../lib/cart')
const mailer = require('../../lib/mailer')
const { show } = require('./ProductController')

const email = (seller,product, buyer) => `
    <h2>Olá ${seller.name}</h2>
    <p>Você tem um novo pedido de compra do seu produto.</p>
    <p>Produto: ${product.name}</p>
    <p>Preço: ${product.formattedPrice}</p>
    <p><br><br></p>
    <h3>Dados do Comprador</h3>
    <p>${buyer.name}</p>
    <p>${buyer.email}</p>
    <p>${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br><br></p>
    <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
    <p><br><br></p>
    <p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
    async index(req, res){
        try {

            const orders = await LoadOrderService.load('orders', { where: {buyer_id: req.session.userId}})
            return res.render("orders/index", { orders })

        } catch (err) {
            console.log(err)
            return res.render("orders/error")
        }
    },

    async post(req, res){
        try {

            // Pegar os produtos do Carrinho
            const cart = Cart.init(req.session.cart)

            // Verifica se o produto não é do próprio comprador
            const buyer_id = req.session.userId

            const filteredItems = cart.items.filter(item => 
                item.product.user_id != buyer_id
            )

            // Criar o Pedido
            const createOrdersPromise = filteredItems.map(async item => {
                let { product, price:total, quantity } = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                // Pega todos os produtos através do Service 
                product = await LoadProductService.load('product', { 
                    where: { id: product_id } 
                }) 

                // Pega os dados do Vendedor 
                const seller = await User.findOne({ 
                    where: { id: seller_id } 
                })

                // Pega os dados do Comprador
                const buyer = await User.findOne({
                    where: { id: buyer_id }
                })

                // Envia email com os dados da compra para o Vendedor
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com',
                    subject: 'Novo pedido de compra',
                    html: email(seller, product, buyer)
                })

                return order

            })

            await Promise.all(createOrdersPromise)

            // Limpando o Carrinho
            delete req.session.cart
            Cart.init()

            // Notificar o sucesso da transação ao usuário 
            return res.render("orders/success")
            
        } catch (err) {
            console.log(err)
            return res.render("orders/error")
        }
    },

    async sales(req, res){
        try {

            const sales = await LoadOrderService.load('orders', { where: {seller_id: req.session.userId}})
            return res.render("orders/sales", { sales })
            
        } catch (err) {
            console.log(err)
            return res.render("orders/sales-error")
        }
    },

    async show(req, res){
        try{

            const order = await LoadOrderService.load('order', { where: {id: req.params.id} })
            return res.render("orders/details", { order })

        } catch (err) {
            console.log(err)
            return res.render("orders/sales-error")
        }

    },

    async update(req, res){
        try {

            const { id, action } = req.params
            const acceptedActions = ['close', 'cancel']

            if(!acceptedActions.includes(action)) return res.send("Cant do this action")

            // Pegar o Pedido
            const order = await Order.findOne({ where: { id }})

            if(!order) return res.send('Order not found')

            // Verificar se o Pedido está aberto
            if(order.status != 'open') return res.send("Cant do this action")

            // Atualizar o Pedido
            const statuses = {
                close: "sold",
                cancel: "cancelled"
            }

            order.status = statuses[action]

            await Order.update(id, {
                status: order.status
            })

            // Redireciona
            return res.redirect('/orders/sales')
            
        } catch (err) {
            console.log(err)
            return res.render("orders/sales-error")
        }
    }
}