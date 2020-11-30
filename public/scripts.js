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
    input: "",

    preview:document.querySelector('#photos-preview'),

    uploadLimit: 6,

    files: [],

    handleFileInput(event){
        const { files: filesList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return
        
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

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
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
        const photoDiv = event.target.parentNode                        // o event.target é o I, o parentNode é um item acima, ou seja, a DIV class Photo
        const photosArray = Array.from(PhotosUpload.preview.children)   // carrega as fotos no photosArray
        const index = photosArray.indexOf(photoDiv)                     // busca o index do item/foto clicado

        PhotosUpload.files.splice(index, 1)                             // encontra o item do array e remove ele
        PhotosUpload.input.files = PhotosUpload.getAllFiles()           // o input é recarregado com o método 

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

    }
}