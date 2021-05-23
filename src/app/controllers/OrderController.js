const User = require('../models/User')
const Order = require('../models/Order')

const LoadProductService = require('../services/LoadProductService')

const Cart = require('../../lib/cart')
const mailer = require('../../lib/mailer')
const { formatPrice, date } = require('../../lib/utils')

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

            // Pegar os pedidos do Usuário
            let orders = await Order.findAll({ where: { buyer_id: req.session.userId } })

            const getOrdersPromise = orders.map(async order => {
                // Detalhes do Produto
                order.product = await LoadProductService.load('product', {
                    where: { id: order.product_id }
                })

                // Detalhes do Comprador
                order.buyer = await User.findOne({ where: { id: order.buyer_id } })

                // Detalhes do Vendedor
                order.seller = await User.findOne({ where: { id: order.seller_id } })

                // Formatação de Preço
                order.formattedPrice = formatPrice(order.price)
                order.formattedTotal = formatPrice(order.total)

                // Formatação do Status
                const statuses = {
                    open: 'Aberto',
                    sold: 'Vendido',
                    cancelled: 'Cancelado'
                }

                order.formattedStatus = statuses[order.status]

                // Formatação para o Status Atualizado
                const updatedAt = date(order.updated_at) 
                order.formattedUpdatedAt = 
                `
                    ${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year}
                    às ${updatedAt.hour}h${updatedAt.minutes}
                `
                return order

            })

            orders = await Promise.all(getOrdersPromise)

            return res.render("orders/index", { orders })
            
        } catch (err) {
            console.error(err)
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
    }
}