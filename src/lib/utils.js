module.exports = {
    date(timestamp){
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()                      //pegando o ano de forma universal, usando o UTC, do timestamp
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)    //pegando o mês ( +1 pois o mês vai de 0 a 11 )
        const day = `0${date.getUTCDate()}`.slice(-2)           //pegando o dia de forma universal, usando o UTC, do timestamp
        
        /*
            No dia e no mês nós add o 0, caso a string retorne um número com um dígito, 
            como o 2, é add 0 na frente (02). O slice(-2) corta os últimos dois digitos
            da string (02), mas caso o número retornado pela string tenha dois dígitos,
            como o 12, é add o 0 (012), e o slice(-2) só pega os últimos dois dígitos, que é
            o 12.
        */
        
        /* Retornando um objeto com várias informações para tratar caso seja necessario do backend */
        return {
            day, month, year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    }
}