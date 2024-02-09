 "use strict";

(() => {
    
    const form = document.querySelector('[data-form]')
    const progressBar = document.querySelector('[data-requirement-progressbar]')
    const fields = {}
    const requeriments = {}
    const state = {passwordStrength : 0}

// -------MOSTRA A MENSAGEM DE ERRO-------
    const showMessageError = (field, message) => {
        const { element, errorElement, } = field   
        element.classList.add('error')
        errorElement.style.display = 'block'
        errorElement.textContent = message

    }
// -------ESCONDE MENSAGEM DE ERRO-------
    const hideMessageError = (field) => {
        const { element, errorElement, } = field
        element.classList.remove('error')
        errorElement.style.display = 'none'
        errorElement.textContent = ''

    }
// -------VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS-------
    const validateRequiredFields = () => {
        let isInvalid = false
        for (const fieldKey in fields) {
            const field = fields[fieldKey]
            const { element, errorElement, isRequired } = field
            if((!element.value || (fieldKey == 'terms' && !element.checked)) && isRequired) {      
                isInvalid = true
                showMessageError(field, 'Esse campo é obrigatório!')               
            }
        }
        return isInvalid
    }
    // ------VALIDAÇÃO DA SENHA / A SENHA DEVERÁ TER------
    const onInputPasswordKeyup = (event) => {
        const  value = event.target
        // Regular Expression
        const lowerCasePattern = new RegExp(/[a-z]/)
        const upperCasePattern = new RegExp(/[A-Z]/)
        const numberPattern = new RegExp(/[0-9]/)
        //const specialCaracherPattern = new RegExp(/[!@#$%\^&*~)\[\]{}?\.(+=\._-]/) 
        if (value.match(lowerCasePattern) && value.match(upperCasePattern) ) {
            state.passwordStrength +=33
            requeriments['lowerUpperCase'].classList.add('checked')
       } else {
            requeriments['lowerUpperCase'].classList.remove('checked')
       }

       if(value.match(numberPattern)) {
            state.passwordStrength +=33
            requeriments['number'].classList.add('checked')
       }else{
        requeriments['number'].classList.remove('checked')
       }
       
       if(value.match(specialCaracherPattern)) {
            state.passwordStrength +=33
            requeriments['specialCharacter'].classList.add('checked')
       }else{
            requeriments['specialCharacter'].classList.remove('checked')
       }
       if(value.length >= 8) {
            //state.passwordStrength +=33
            requeriments['mainCharacter'].classList.add('checked')
       }else{
            requeriments['mainCharacter'].classList.remove('checked')
       }

       //progressBar.style.width ='${state.passwordStrength}%'

    }
    // ------FUNÇÃO FOCUS
    const onInputFocus = (event) => {   
        hideMessageError (fields[event.target.name])
    }

    const onFormSubmit = (event) => {
        event.preventDefault()
        if (validateRequiredFields()) {
            return
        }                   
        alert('Cadastro realizado!')
    }

    const setRequirementItemsElements =() => {
        const requirementItemsElements = document.querySelector('[data-requirement-item]')
        for (const requerimentItem of requirementItemsElements) {
            const requerimentName  = requerimentItem.dataset['requirementItem']
            requeriments[requerimentName] = requerimentItem
        }
    }

    const setListeners = () => {
        form.addEventListener('submit', onFormSubmit) 
        for (const fieldKey in fields){
            const {element} = fields[fieldKey]
            element.addEventListener('focus', onInputFocus)
            if(field == 'password') element.addEventListener('keyup', onInputPasswordKeyup)
        }
    }
    
    const setFieldElements = () => {
        const inputElements = document.querySelectorAll('[data-input]')
        for (const input of inputElements) {
            const inputName = input.getAttribute('name')
            fields[inputName] = {
                element: input,
                errorElement: input.parentElement.querySelector('[data-error-message]'),
                isRequired: input.hasAttribute('required')               
            }
            input.removeAttribute('required')
        }

    }

    const init = () => {
        setFieldElements()
        setRequirementItemsElements()
        setListeners()

    }

    init()

})();