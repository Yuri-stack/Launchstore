const Mask = {
    apply(input, func){     // func é qualquer função que possa ser chamada
        
        setTimeout(function(){
            input.value = Mask[func](input.value)   // Atualiza o valor do input / Mask[func] == Mask.formatBRL(input.value)
        }, 1)

    },
    formatBRL(value){

        value = value.replace(/\D/g, "")    // Usando Expressão Regular para retirar texto

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',              // Formatando para moeda
            currency: 'BRL'                 // Colocando o símbolo da moeda escolhida
        }).format(value/100)                // Dividindo o valor por 100 para formatar em formato de moeda

    }
}