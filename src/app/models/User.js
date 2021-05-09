const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
}

   // async create(data){

    //     try {
        
    //         const query = `
    //             INSERT INTO users (
    //                 name,
    //                 email,
    //                 password,
    //                 cpf_cnpj,
    //                 cep,
    //                 address
    //             ) VALUES ($1, $2, $3, $4, $5, $6)
    //             RETURNING id
    //         `

    //         // Criptografar Senha com HASH
    //         const passwordHash = await hash(data.password, 8)

    //         const values = [
    //             data.name,
    //             data.email,
    //             passwordHash,
    //             data.cpf_cnpj.replace(/\D/g,""),
    //             data.cep.replace(/\D/g,""),
    //             data.address
    //         ]

    //         const results = await db.query(query, values)
    //         return results.rows[0].id
            
    //     } catch (error) {
    //         console.log(error)
    //     }

    // },

    // async update(id, fields){

    //     let query = "UPDATE users SET"

    //     Object.keys(fields).map((key, index, array) => {
    //         if((index + 1) < array.length){
    //             query = `
    //                 ${query}
    //                 ${key} = '${fields[key]}',
    //             `
    //         }else{
    //             query = `
    //                 ${query}
    //                 ${key} = '${fields[key]}'
    //                 WHERE id = ${id}
    //             `
    //         }
    //     })

    //     await db.query(query)
    //     return
    // },

    // async delete(id){

    //     // Pega os Produtos
    //     let results = await db.query("SELECT * FROM products WHERE user_id = $1", [id])
    //     const products = results.rows

    //     // Pega as imagens dos Produtos
    //     const allFilesPromise = products.map(product =>
    //         Product.files(product.id)
    //     )

    //     let promiseResults = await Promise.all(allFilesPromise)

    //     // Remove o Usuário
    //     let query = `DELETE FROM users WHERE id = $1`
    //     await db.query(query, [id])

    //     // Remove as imagens da Public
    //     promiseResults.map(results => {
    //         results.rows.map(file => {

    //             try {
    //                 fs.unlinkSync(file.path)
                    
    //             } catch (error) {
    //                 console.log(error)
    //             }

    //         })
    //     })

    // }