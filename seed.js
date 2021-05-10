const User = require('./src/app/models/User')

const { hash } = require('bcryptjs')

const faker = require('faker')

let usersIds = []

async function createUsers(){
    const users = []
    const password = await hash('1111', 8)

    while(users.length < 3){
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(99999999),
            cep: faker.random.number(9999999999),
            address: faker.address.streetName()
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

createUsers()