"use strict";
(function () {
    const maybeForm = document.querySelector('.form-registro');
    if (!(maybeForm instanceof HTMLFormElement))
        return;
    const form = maybeForm;
    const maybeFeedback = form.nextElementSibling;
    if (!(maybeFeedback instanceof HTMLElement))
        return;
    const feedback = maybeFeedback;
    const MIN_PASSWORD_LENGTH = 8;
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }
    function setFieldError(field, message) {
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        const describedBy = field.getAttribute('aria-describedby') || '';
        const errorId = describedBy.split(' ').find((id) => id.indexOf('error-') === 0);
        if (!errorId)
            return;
        const errorEl = document.getElementById(errorId);
        if (errorEl)
            errorEl.textContent = message;
    }
    function validate() {
        let valid = true;
        const nombre = form.querySelector('#nombre');
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        const confirmar = form.querySelector('#confirmar-password');
        if (nombre) {
            if (!nombre.value.trim()) {
                setFieldError(nombre, 'Ingresa tu nombre.');
                valid = false;
            }
            else {
                setFieldError(nombre, '');
            }
        }
        if (email) {
            if (!email.value.trim()) {
                setFieldError(email, 'Ingresa tu correo electrónico.');
                valid = false;
            }
            else if (!isValidEmail(email.value)) {
                setFieldError(email, 'Ingresa un correo electrónico válido (ej. nombre@correo.com).');
                valid = false;
            }
            else {
                setFieldError(email, '');
            }
        }
        if (password) {
            if (!password.value) {
                setFieldError(password, 'Crea una contraseña.');
                valid = false;
            }
            else if (password.value.length < MIN_PASSWORD_LENGTH) {
                setFieldError(password, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
                valid = false;
            }
            else {
                setFieldError(password, '');
            }
        }
        if (confirmar) {
            if (!confirmar.value) {
                setFieldError(confirmar, 'Confirma tu contraseña.');
                valid = false;
            }
            else if (password && confirmar.value !== password.value) {
                setFieldError(confirmar, 'Las contraseñas no coinciden.');
                valid = false;
            }
            else {
                setFieldError(confirmar, '');
            }
        }
        return valid;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        feedback.textContent = '';
        feedback.classList.remove('form-feedback--success', 'form-feedback--error');
        if (validate()) {
            feedback.textContent = '¡Cuenta creada correctamente! Ya puedes iniciar sesión.';
            feedback.classList.add('form-feedback--success');
            form.reset();
        }
        else {
            feedback.textContent = 'Revisa los campos marcados en rojo.';
            feedback.classList.add('form-feedback--error');
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid)
                firstInvalid.focus();
        }
    });
})();
