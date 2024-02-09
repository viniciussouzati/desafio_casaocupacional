const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// --------ANÁLISE DOS DADOS DO FORMULÁRIO--------
app.use(bodyParser.urlencoded({ extended: true }));

// --------ARQUIVOS ESTÁTICOS--------
app.use(express.static('public'));

// --------GET--------
app.get('/login', (req, res) => {
    fs.readFile(path.join(__dirname, 'assets', 'public', 'login.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo HTML:', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }
        const htmlWithScript = data.replace('</body>', `
        <script>
            "use strict";
            (() => {
                // Função para validar o formulário de cadastro
                function validateForm() {
                    const emailInput = document.getElementById('email');
                    const passwordInput = document.getElementById('password');
                    const emailError = document.getElementById('emailError');
                    const passwordError = document.getElementById('passwordError');
                    
                    // Verificar se o campo de e-mail está vazio ou não é um e-mail válido
                    if (!emailInput.value) {
                        showMessageError(emailInput, emailError, 'Por favor, preencha o campo de e-mail.');
                        return false;
                    } else if (!isValidEmail(emailInput.value)) {
                        showMessageError(emailInput, emailError, 'Por favor, insira um e-mail válido.');
                        return false;
                    } else {
                        hideMessageError(emailInput, emailError);
                    }
                    
                    // Verificar se o campo de senha está vazio ou tem menos de 8 caracteres
                    if (!passwordInput.value) {
                        showMessageError(passwordInput, passwordError, 'Por favor, preencha o campo de senha.');
                        return false;
                    } else if (passwordInput.value.length < 8) {
                        showMessageError(passwordInput, passwordError, 'A senha deve ter pelo menos 8 caracteres.');
                        return false;
                    } else {
                        hideMessageError(passwordInput, passwordError);
                    }
    
                    // Redirecionar após a validação dos campos
                    window.location.href = "https://www.casaocupacional.com.br/";
                    return false;
                }
    
                // Função para exibir mensagem de erro
                function showMessageError(input, errorElement, message) {
                    input.classList.add('error');
                    errorElement.style.display = 'block';
                    errorElement.textContent = message;
                }
    
                // Função para ocultar mensagem de erro
                function hideMessageError(input, errorElement) {
                    input.classList.remove('error');
                    errorElement.style.display = 'none';
                    errorElement.textContent = '';
                }
    
                // Função para verificar se um e-mail é válido
                function isValidEmail(email) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(email);
                }
    
            })();
        </script>
    </body>`);
    res.send(htmlWithScript);
    });
 });
      
app.get('/', (req, res) => {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo HTML:', err);
            res.status(500).send('Erro interno do servidor');
            return;
        }
        // --------VALIDAÇÃO DOS CAMPOS--------
        const htmlWithScript = data.replace('</body>', `
        <script>
            "use strict";
            (() => {
                const form = document.querySelector('[data-form]');
                const progressBar = document.querySelector('[data-requirement-progressbar]')
                const fields = {};
                const requeriments = {};
                const state = {passwordStrength : 0}
    
                const showMessageError = (field, message) => {
                    const { element, errorElement } = field;
                    element.classList.add('error');
                    errorElement.style.display = 'block';
                    errorElement.textContent = message;
                };
    
                const hideMessageError = (field) => {
                    const { element, errorElement } = field;
                    element.classList.remove('error');
                    errorElement.style.display = 'none';
                    errorElement.textContent = '';
                };
    
                const validateRequiredFields = () => {
                    let isInvalid = false;
                    for (const fieldKey in fields) {
                        const field = fields[fieldKey];
                        const { element, errorElement, isRequired } = field;
                        if ((!element.value || (fieldKey == 'terms' && !element.checked)) && isRequired) {
                            isInvalid = true;
                            showMessageError(field, 'Esse campo é obrigatório!');
                        }
                    }
                    return isInvalid;
                };
    
                const validatePasswordStrength = () => {
                    const field = fields['password'];
                    const value = field.element.value;
                    const lowerCasePattern = /[a-z]/;
                    const upperCasePattern = /[A-Z]/;
                    const numberPattern = /[0-9]/;
                    const lengthRequirement = value.length >= 8;
    
                    if (!lowerCasePattern.test(value) || !upperCasePattern.test(value) || !numberPattern.test(value) || !lengthRequirement) {
                        showMessageError(field, 'Digite uma senha válida!');
                        return false;
                    }
                    return true;
                };
    
                const validateEmail = (email) => {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(email);
                };
    
                const onInputPasswordKeyup = (event) => {
                    const value = event.target.value;
                    const lowerCasePattern = /[a-z]/;
                    const upperCasePattern = /[A-Z]/;
                    const numberPattern = /[0-9]/;
    
                    state.passwordStrength = 0;
    
                    if (value.match(lowerCasePattern) && value.match(upperCasePattern) ) {
                        state.passwordStrength += 33;
                        requeriments['lowerUpperCase'].classList.add('checked');
                    } else {
                        requeriments['lowerUpperCase'].classList.remove('checked');
                    }
    
                    if(value.match(numberPattern)) {
                        state.passwordStrength += 33;
                        requeriments['number'].classList.add('checked');
                    } else {
                        requeriments['number'].classList.remove('checked');
                    }
    
                    if(value.length >= 8) {
                        state.passwordStrength += 33;
                        requeriments['mainCharacter'].classList.add('checked');
                    } else {
                        requeriments['mainCharacter'].classList.remove('checked');
                    }
                };
    
                const onInputEmailBlur = (event) => {
                    const value = event.target.value;
                    const field = fields['email'];
                    if (!validateEmail(value)) {
                        showMessageError(field, 'Por favor, insira um e-mail válido.');
                    } else {
                        hideMessageError(field);
                    }
                };
    
                const onInputFocus = (event) => {
                    hideMessageError(fields[event.target.name]);
                };
    
                const onFormSubmit = (event) => {
                    event.preventDefault();
                    if (validateRequiredFields() || !validatePasswordStrength()) return;
                    alert('Cadastro realizado!');
                };
    
                const setListeners = () => {
                    form.addEventListener('submit', onFormSubmit);
                    for (const fieldKey in fields) {
                        const { element } = fields[fieldKey];
                        element.addEventListener('focus', onInputFocus);
                        if (fieldKey === 'password') element.addEventListener('keyup', onInputPasswordKeyup);
                        if (fieldKey === 'email') element.addEventListener('blur', onInputEmailBlur);
                    }
                    // Adicionando evento de clique para exibir a senha
                    const passwordEye = document.querySelector('[data-password-eye]');
                    const inputPassword = document.querySelector('[name="password"]');
                    passwordEye.addEventListener('click', () => {
                        inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
                        passwordEye.classList.toggle('slash');
                    });
                };
    
                const setFieldElements = () => {
                    const inputElements = document.querySelectorAll('[data-input]');
                    for (const input of inputElements) {
                        const inputName = input.getAttribute('name');
                        fields[inputName] = {
                            element: input,
                            errorElement: input.parentElement.querySelector('[data-error-message]'),
                            isRequired: input.hasAttribute('required')
                        };
                        input.removeAttribute('required');
                    }
                };
    
                const setRequirementItemsElements = () => {
                    const requirementItemsElements = document.querySelectorAll('[data-requirement-item]');
                    for (const requerimentItem of requirementItemsElements) {
                        const requerimentName = requerimentItem.dataset['requirementItem'];
                        requeriments[requerimentName] = requerimentItem;
                    }
                };
    
                const init = () => {
                    setFieldElements();
                    setRequirementItemsElements();
                    setListeners();
                };
    
                init();
            })();
        </script>
    </body>`);
    
    
    
        res.send(htmlWithScript);
    });
});

// ----------------POST----------------
app.post('/', (req, res) => {
    const { name, email, password, terms } = req.body;
    
    // Envie uma resposta de sucesso
    res.redirect('/login');
});


// ----------------CSS----------------
app.use('/assets/css', express.static(path.join(__dirname, 'assets', 'css')));

// ----------------FONTS----------------
app.use('/assets/fonts', express.static(path.join(__dirname, 'assets', 'fonts')));

// ----------------IMG----------------
app.use('/assets/img', express.static(path.join(__dirname, 'assets', 'img')));

// ----------------START SERVIDOR----------------
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
