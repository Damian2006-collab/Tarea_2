"use strict";
(function () {
    const maybeForm = document.querySelector('.form-contacto');
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
        const nombre = form.querySelector('#nombre');
        const email = form.querySelector('#email');
        const mensaje = form.querySelector('#mensaje');
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
        if (mensaje) {
            if (!mensaje.value.trim()) {
                setFieldError(mensaje, 'Escribe tu mensaje.');
                valid = false;
            }
            else {
                setFieldError(mensaje, '');
            }
        }
        return valid;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        feedback.textContent = '';
        feedback.classList.remove('form-feedback--success', 'form-feedback--error');
        if (validate()) {
            feedback.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
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
