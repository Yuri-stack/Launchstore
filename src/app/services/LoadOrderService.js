const Order = require('../models/Order')
const User = require('../models/User')
const LoadProductService = require('../services/LoadProductService')

const { formatPrice, date } = require('../../lib/utils')

async function format(order){
    // Detalhes do Produto
    order.product = await LoadProductService.load('productWithDeleted', {
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
}

const LoadService = {

    // Recebe o Filtro(Where...) e Retorna o Service pedido
    load(service, filter){
        this.filter = filter;
        return this[service]()
    },

    async order(){
        try {
            
            const order = await Order.findOne(this.filter)

            return format(order)
        } catch (error) {
            console.error(error)
        }
    },

    async orders(){
        try {

            // Pegar os pedidos do Usuário
            const orders = await Order.findAll(this.filter)
            const ordersPromise = orders.map(format)

            return Promise.all(ordersPromise)
        } catch (error) {
            console.error(error)
        }
    },
    format,
}

module.exports = LoadService