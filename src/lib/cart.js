const { formatPrice } = require('./utils')

const Cart = {
    init(oldCart){
        if(oldCart){
            this.items = oldCart.items
            this.total = oldCart.total
        }else{
            this.items = []
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
        }

        return this
    },

    addOne(product){
        let inCart = this.getCartItem(product.id)

        if(!inCart){
            inCart = {
                product:{
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
            this.items.push(inCart)
        }

        // Lógica para caso o item exceda a quantidade maxima
        if(inCart.quantity >= product.quantity) return this

        // Atualizando o item
        inCart.quantity++
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        // Atualizando o carrinho
        this.total.quantity++
        this.total.price += inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        return this
    },

    removeOne(productId){
        const inCart = this.getCartItem(productId)

        if(!inCart) return this

        // Atualizar o item
        inCart.quantity--
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        // Atualiza o carrinho
        this.total.quantity--
        this.total.price -= inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        if(inCart.quantity < 1){
            this.items.filter(item => item.product.id != inCart.product.id)
            return this
        }

        // if(inCart.quantity < 1){
        //     const itemIndex = this.items.indexOf(inCart)
        //     this.items.splice(itemIndex, 1)
        //     return this
        // }

        return this

    },

    delete(productId){
        const inCart = this.getCartItem(productId)

        if(!inCart) return this

        // Atualizar o item
        if(this.items.length > 0){
            this.total.quantity -= inCart.quantity
            this.total.price -= (inCart.product.price * inCart.quantity)
            this.total.formattedPrice = formatPrice(this.total.price)
        }

        this.items = this.items.filter(item => inCart.product.id != item.product.id)
        return this

    },

    getCartItem(productId){
        return this.items.find(item => item.product.id == productId)
    }
}

module.exports = Cart