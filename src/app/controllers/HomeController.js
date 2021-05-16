const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res){
        try {
            //Pega todos os produtos atraves do Service
            const allProducts = await LoadProductService.load('products')

            //Cria um filtro para enviar apenas 3 produtos para o Index
            const products = allProducts.filter((product, index) => index > 2 ? false : true)

            return res.render("home/index", { products })
        } catch (err) {
            console.log(err)
        }
    }
}