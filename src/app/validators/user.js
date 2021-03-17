const User = require('../models/User')

async function post(req, res, next){

    const keys = Object.keys(req.body)                  

    for(key of keys){                       
        if(req.body[key] == ""){
            return res.send('Por favor preencha os campos / Please, fill all fields')
        }
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body
    
    cpf_cnpj = cpf_cnpj.replace(/\D/g,"")

    // Checar se o Usuário já existe
    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.send('User exists')
    
    if(password != passwordRepeat)
        return res.send('Password Mismatch')
    
    next()

}

module.exports = { post }