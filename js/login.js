"use strict";
(function () {
    const maybeForm = document.querySelector('.form-login');
    if (!(maybeForm instanceof HTMLFormElement))
        return;
    const form = maybeForm;
    const maybeFeedback = form.nextElementSibling;
    if (!(maybeFeedback instanceof HTMLElement))
        return;
    const feedback = maybeFeedback;
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
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
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
                setFieldError(password, 'Ingresa tu contraseña.');
                valid = false;
            }
            else {
                setFieldError(password, '');
            }
        }
        return valid;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        feedback.textContent = '';
        feedback.classList.remove('form-feedback--success', 'form-feedback--error');
        if (validate()) {
            feedback.textContent = '¡Bienvenido de vuelta! Iniciando sesión...';
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
