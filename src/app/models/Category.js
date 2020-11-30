const db = require('../../config/db')

module.exports = {

    //Função para CARREGAR todas as categorias
    all(){
        return db.query(`
            SELECT * FROM categories
        `)
    }

}