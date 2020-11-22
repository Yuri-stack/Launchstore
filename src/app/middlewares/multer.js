const multer = require('multer')    

const storage = multer.diskStorage({    // função onde config o destino do arquivo e o seu nome
    destination: (req, file, cb) => {  
        cb(null, './public/images')     // destino do arquivo | cb = callback
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`)   // nome do arquivo salvo (data do Upload + nome do arquivo)
    }
})

const fileFilter = (req, file, cb) => {
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'] // definindo os tipos de arq. permitidos
    .find(acceptedFormat => acceptedFormat == file.mimetype)    // para cada arquivo que será salvo, verifica se seu tipo é permitido 

    if(isAccepted){
        return cb(null, true)
    }

    return cb(null, false)
}

module.exports = multer({
    storage,
    fileFilter
})