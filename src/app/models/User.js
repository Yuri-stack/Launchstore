const db = require('../../config/db')

module.exports = {

    //Função para RETORNAR os dados de um Usuário
    async findOne(filters){

        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            
            // Aqui recebemos essas cláusulas WHERE | OR | AND
            query = `
                ${query}
                ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })

        })

        const results = await db.query(query)
        return results.rows[0]
    }

}