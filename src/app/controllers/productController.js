const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const LoadProductService = require('../services/LoadProductService')

const { unlinkSync } = require('fs')

module.exports = {
    async create(req, res){

        try {
            const categories = await Category.findAll()
            return res.render('products/create', { categories })
        } catch (error) {
            console.error(error)
        }        
    },

    async post(req, res){

        try {

            let { category_id, name, description, old_price, price, quantity, status } = req.body

            price = price.replace(/\D/g, "")  // Usando Expressão Regular para retirar caracteres de texto

            const product_id = await Product.create({ 
                category_id, 
                user_id: req.session.userId,
                name, 
                description, 
                old_price: old_price || price, 
                price, 
                quantity, 
                status: status || 1
             })

            // criamos uma Array de Promises, onde salvarão as imagens
            const filesPromise = req.files.map(file => 
                File.create({ name: file.filename, path:file.path, product_id })) 
            // executa as Promises guardadas no Array
            await Promise.all(filesPromise)
    
            return res.redirect(`/products/${product_id}/edit`)
            
        } catch (err) {
            console.log(err)
        }
    },

    async show(req, res){

        try {
            const product = await LoadProductService.load('product', { 
                where: { id: req.params.id } 
            })
    
            return res.render("products/show", { product })

        } catch (err) {
            console.log(err)
        }
    },

    async edit(req, res){

        try {
            const product = await LoadProductService.load('product', { 
                where: { id: req.params.id } 
            })
    
            // Carrega Categorias
            const categories = await Category.findAll()
        
            return res.render("products/edit.njk", { product, categories })
            
        } catch (err) {
            console.log(err)
        }
    },

    async put(req, res){
        
        try {
    
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

            // Lógica para Excluir as imagens do BD
            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
    
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
    
                await Promise.all(removedFilesPromise)
            }
        
            req.body.price = req.body.price.replace(/\D/g, "")
    
            if(req.body.old_price != req.body.price){
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.price
            }
    
            await Product.update(req.body.id, {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status,
            })
    
            return res.redirect(`/products/${req.body.id}`)
            
        } catch (err) {
            console.log(err)
        }
    },

    async delete(req, res){

        try {
            // Pega todos os arquivos/fotos do Produto
            const files = await Product.files(req.body.id)

            //  Apaga o Produto
            await Product.delete(req.body.id)

            // Deleta os Arquivos/Fotos
            files.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (error) {
                    console.log(error)
                }
            })

            return res.redirect('/products/create')
            
        } catch (err) {
            console.log(err)
        }
    }
}