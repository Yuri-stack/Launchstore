const User = require('../models/User')

async function post(req, res, next){

    const keys = Object.keys(req.body)                  

    for(key of keys){                       
        if(req.body[key] == ""){
            return res.render('user/register', { 
                user: req.body,
                error: 'Por favor preencha os campos'
            })
        }
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body
    
    cpf_cnpj = cpf_cnpj.replace(/\D/g,"")

    // Checar se o Usuário já existe
    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) {
        return res.render('user/register', { 
            user: req.body,
            error: 'Usuário já cadastrado'
        })
    }
    
    if(password != passwordRepeat)
        return res.render('user/register', { 
            user: req.body,
            error: 'As senhas não conferem'
        })
    
    next()

}

module.exports = { post }