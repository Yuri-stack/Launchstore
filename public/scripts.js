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

const PhotosUpload = {

    preview:document.querySelector('#photos-preview'),

    uploadLimit: 6,

    handleFileInput(event){
        const { files: filesList } = event.target

        if(PhotosUpload.hasLimit(event)) return
        
        Array.from(filesList).forEach(file => {
            const reader = new FileReader()                     //instanciando um construtor para carregar um arquivo

            reader.onload = () => {
                const image = new Image()                       //criando uma tag <img />
                image.src = String(reader.result)               //resultado do carregamento

                const div = PhotosUpload.getContainer(image)    //chama o método e passa a image para ele
                PhotosUpload.preview.appendChild(div)

            }

            reader.readAsDataURL(file)
        })

    },

    hasLimit(event){
        const { uploadLimit } = PhotosUpload
        const { files: filesList } = event.target

        //Validando a quantidade de fotos enviadas
        if(filesList.lenght > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        return false
    },

    getContainer(image){
        const container = document.createElement('div')         //cria uma DIV
        container.classList.add('photo')                        //add uma classe chamada photo a DIV

        container.onclick = PhotosUpload.removePhoto      //quando clicar na DIV, aparece uma para apagar a img

        container.appendChild(image)                            //add a image na DIV chamada Container

        container.appendChild(PhotosUpload.getRemoveButton())   //add o button na DIV chamada Container

        return container
    },

    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },

    removePhoto(event){
        const photoDiv = event.target.parentNode                        // o event.target é o I, o parentNode é um item acima, ou seja, a DIV
        const photosArray = Array.from(PhotosUpload.preview.children)   // carrega as fotos no photosArray
        const index = photosArray.indexOf(photoDiv)                     // busca o index do item/foto clicado

        photoDiv.remove()
    }

}