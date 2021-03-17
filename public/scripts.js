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

    },
    cpfCnpj(value){

        value = value.replace(/\D/g, "")    // Usando Expressão Regular para retirar texto

        if(value.length > 14){
            value = value.slice(0,-1)
        }

        if(value.length > 11){
            // value = 11222333444455

            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            // value = 11.222333444455

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // value = 11.222.333444455

            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            // value = 11.222.333/444455

            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            // value = 11.222.333/4444-55

        } else {
            // value = 11122233344

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // value = 111.22233344

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // value = 111.222.33344

            value = value.replace(/(\d{3})(\d)/, "$1-$2")
            // value = 111.222.333-44
        }

        return value

    },
    cep(value){

        value = value.replace(/\D/g, "")    // Usando Expressão Regular para retirar texto 

        if(value.length > 8){
            value = value.slice(0,-1)
        }

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }

}

const PhotosUpload = {
    
    input: "",
    preview:document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],

    handleFileInput(event){
        const { files: filesList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)){
            PhotosUpload.updateImputFiles()
            return 
        }
        
        Array.from(filesList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()                     //instanciando um construtor para carregar um arquivo

            reader.onload = () => {
                const image = new Image()                       //criando uma tag <img />
                image.src = String(reader.result)               //resultado do carregamento

                const div = PhotosUpload.getContainer(image)    //chama o método e passa a image para ele
                PhotosUpload.preview.appendChild(div)

            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateImputFiles()
    },

    hasLimit(event){
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: filesList } = input

        //Validando a quantidade de fotos enviadas
        if(filesList.lenght > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo"){
                photosDiv.push(item)
            }
        })

        const totalPhotos = filesList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert('Você atingiu o máximo de fotos')
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles(){
        const dataTransfer = 
            new ClipboardEvent("").clipboardData || // o clipboard é para o Firefox
            new DataTransfer()                      // construto para guardar dados arrastados durante uma operação de Arrastar e Soltar
        
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files


    },

    getContainer(image){
        const container = document.createElement('div')         //cria uma DIV
        container.classList.add('photo')                        //add uma classe chamada photo a DIV

        container.onclick = PhotosUpload.removePhoto            //quando clicar na DIV, aparece uma para apagar a img

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
        const photoDiv = event.target.parentNode                        // o event.target é o I, o parentNode é um item acima, ou seja, a DIV class Photo
        
        const newFiles = Array.from(PhotosUpload.preview.children)
        .filter(function(file) {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })                                                              // carrega as fotos no photosArray
        
        const index = newFiles.indexOf(photoDiv)                        // busca o index do item/foto clicado
        PhotosUpload.files.splice(index, 1)                             // encontra o item do array e remove ele
        
        PhotosUpload.updateImputFiles()
        photoDiv.remove()
    },

    removeOldPhoto(event){

        const photoDiv = event.target.parentNode

        if(photoDiv.id){

            const removedFiles = document.querySelector('input[name="removed_files"]')

            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }

        }

        photoDiv.remove()
    },

    updateImputFiles(){
        PhotosUpload.input.files = PhotosUpload.getAllFiles()           // o input é recarregado com o método 
    }
}

const ImageGallery = {

    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),

    setImage(e){
        const { target } = e

        ImageGallery.previews.forEach( preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        LightBox.image.src = target.src
    }

}

const LightBox = {

    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

    open(){
        LightBox.target.style.opacity = 1
        LightBox.target.style.top = 0
        LightBox.target.style.bottom = 0
        LightBox.closeButton.style.top = 0
    },

    close(){
        LightBox.target.style.opacity = 0
        LightBox.target.style.top = "-100%"
        LightBox.target.style.bottom = "initial"
        LightBox.closeButton.style.top = "-80px"
    }

}

const Validate = {
    apply(input, func){

        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error){
            Validate.displayError(input, results.error)
        }

    },

    displayError(input, error){

        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()

    },

    clearErrors(input){

        const errorDiv = input.parentNode.querySelector(".error")

        if(errorDiv){
            errorDiv.remove()
        }

    },

    isEmail(value){
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat)){
            error = "Email inválido"
        }

        return{
            error,
            value
        }
    }

}