const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {

    create(req, res){

        try {

            Category.all().then(function(results){
                const categories = results.rows
                return res.render('products/create.njk', { categories })
    
            }).catch(function(err){
                throw new Error(err)
            })
            
        } catch (err) {
            console.log(err)
        }
        
    },

    async post(req, res){

        try {

            const keys = Object.keys(req.body)                  

            for(key of keys){                       
                if(req.body[key] == ""){
                    return res.send('Por favor preencha os campos / Please, fill all fields')
                }
            }
    
            if(req.files.lenght == 0)
                return res.send('Por favor, envie pelos uma imagem')
                                                                                                             
            let results = await Product.create(req.body)
            const productID = results.rows[0].id
    
            const filesPromise = req.files.map(file => File.create({...file, product_id: productID})) // criamos uma Array de Promises, onde salvarão as imagens
            await Promise.all(filesPromise)    // executa as Promises guardadas no Array
    
            return res.redirect(`/products/${productID}`)
            
        } catch (err) {
            console.log(err)
        }

    },

    async show(req, res){

        try {

            let results = await Product.find(req.params.id)
            const product = results.rows[0]
    
            if(!product) return res.send("Produto não encontrado / Product not found")
    
            const { day, hour, minutes, month } = date(product.updated_at)
    
            product.published = {
                day: `${day}/${month}`,
                hour: `${hour}h${minutes}`
            }
    
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
    
            results = await Product.files(product.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
    
            return res.render("products/show", { product, files })
            
        } catch (err) {
            console.log(err)
        }

    },

    async edit(req, res){

        try {

            let results = await Product.find(req.params.id)
            const product = results.rows[0]
    
            if(!product) return res.send("Product not found!")
    
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
    
            // Carrega Categorias
            results = await Category.all()
            const categories = results.rows
    
            // Carrega Imagens
            results = await Product.files(product.id)
            let files = results.rows
    
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
    
            return res.render("products/edit.njk", { product, categories, files })
            
        } catch (err) {
            console.log(err)
        }

    },

    async put(req, res){
        
        try {

            const keys = Object.keys(req.body)                  

            for(key of keys){                       
                if(req.body[key] == "" && key != "removed_files"){
                    return res.send('Por favor preencha os campos / Please, fill all fields')
                }
            }

            // Lógica para Excluir as imagens do BD
            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
    
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
    
                await Promise.all(removedFilesPromise)
            }
    
            // Lógica para SALVAR as novas imagens carregadas durante a Atualização
            if(req.files.length != 0){

                // Lógica para verificar se já existem 6 imagens cadastradas
                const oldFiles = await Product.files(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6){
                    const newFilesPromise = req.files.map(file => 
                        File.create({...file, product_id: req.body.id}))
                    
                    await Promise.all(newFilesPromise)
                }
            }
        
            req.body.price = req.body.price.replace(/\D/g, "")
    
            if(req.body.old_price != req.body.price){
                const old_product = await Product.find(req.body.id)
                req.body.old_price = old_product.rows[0].price
            }
    
            await Product.update(req.body)
    
            return res.redirect(`/products/${req.body.id}`)
    
            
        } catch (err) {
            console.log(err)
        }

    },

    async delete(req, res){

        try {
            await Product.delete(req.body.id)
            return res.redirect('/products/create')
        } catch (err) {
            console.log(err)
        }
    }
}