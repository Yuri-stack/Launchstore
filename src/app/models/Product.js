const Base = require('./Base')

const db = require('../../config/db')

Base.init({ table: 'products' })

module.exports = {
    ...Base,
    
    //Função para CARREGAR os arquivos/imagens do produto
    async files(id){
        const results = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
        return results.rows
    },

    //Função para BUSCAR os produtos
    async search(params){

        const { filter, category } = params

        let query = "",
            filterQuery = `WHERE`

        if(category){
            filterQuery = `
                ${filterQuery}
                products.category_id = ${category}
                AND
            `
        }

        filterQuery = `
            ${filterQuery} (
            products.name ilike '%${filter}%'
            OR products.description ilike '%${filter}%')
        `

        query = `
            SELECT products.*, categories.name AS category_name
            FROM products 
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `

        const results = await db.query(query)
        return results.rows

    }
}  
