(function () {
  const maybeForm = document.querySelector('.form-registro');
  if (!(maybeForm instanceof HTMLFormElement)) return;
  const form: HTMLFormElement = maybeForm;

  const maybeFeedback = form.nextElementSibling;
  if (!(maybeFeedback instanceof HTMLElement)) return;
  const feedback: HTMLElement = maybeFeedback;

  const MIN_PASSWORD_LENGTH = 8;
  const MIN_AGE = 13;
  const MAX_AGE = 120;

  type PasswordStrength = 'weak' | 'medium' | 'strong';

  const STRENGTH_LABEL: Record<PasswordStrength, string> = {
    weak: 'Fuerza: débil',
    medium: 'Fuerza: media',
    strong: 'Fuerza: fuerte',
  };

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function getPasswordStrength(value: string): PasswordStrength {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  function getAge(dobValue: string): number | null {
    const dob = new Date(dobValue);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  function setFieldError(field: HTMLInputElement, message: string): void {
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    const describedBy = field.getAttribute('aria-describedby') || '';
    const errorId = describedBy.split(' ').find((id) => id.indexOf('error-') === 0);
    if (!errorId) return;
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
  }

  function updateStrengthMeter(value: string): void {
    const meter = document.getElementById('password-strength');
    if (!meter) return;

    meter.classList.remove('password-strength--weak', 'password-strength--medium', 'password-strength--strong');

    if (!value) {
      meter.textContent = '';
      return;
    }

    const strength = getPasswordStrength(value);
    meter.textContent = STRENGTH_LABEL[strength];
    meter.classList.add(`password-strength--${strength}`);
  }

  const passwordInput = form.querySelector<HTMLInputElement>('#password');
  passwordInput?.addEventListener('input', () => {
    updateStrengthMeter(passwordInput.value);
  });

  function validate(): boolean {
    let valid = true;

    const nombre = form.querySelector<HTMLInputElement>('#nombre');
    const email = form.querySelector<HTMLInputElement>('#email');
    const fechaNacimiento = form.querySelector<HTMLInputElement>('#fecha-nacimiento');
    const password = form.querySelector<HTMLInputElement>('#password');
    const confirmar = form.querySelector<HTMLInputElement>('#confirmar-password');

    if (nombre) {
      if (!nombre.value.trim()) {
        setFieldError(nombre, 'Ingresa tu nombre.');
        valid = false;
      } else {
        setFieldError(nombre, '');
      }
    }

    if (email) {
      if (!email.value.trim()) {
        setFieldError(email, 'Ingresa tu correo electrónico.');
        valid = false;
      } else if (!isValidEmail(email.value)) {
        setFieldError(email, 'Ingresa un correo electrónico válido (ej. nombre@correo.com).');
        valid = false;
      } else {
        setFieldError(email, '');
      }
    }

    if (fechaNacimiento) {
      if (!fechaNacimiento.value) {
        setFieldError(fechaNacimiento, 'Ingresa tu fecha de nacimiento.');
        valid = false;
      } else {
        const age = getAge(fechaNacimiento.value);
        if (age === null || age < 0 || age > MAX_AGE) {
          setFieldError(fechaNacimiento, 'Ingresa una fecha de nacimiento válida.');
          valid = false;
        } else if (age < MIN_AGE) {
          setFieldError(fechaNacimiento, `Debes tener al menos ${MIN_AGE} años para registrarte.`);
          valid = false;
        } else {
          setFieldError(fechaNacimiento, '');
        }
      }
    }

    if (password) {
      if (!password.value) {
        setFieldError(password, 'Crea una contraseña.');
        valid = false;
      } else if (password.value.length < MIN_PASSWORD_LENGTH) {
        setFieldError(password, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        valid = false;
      } else if (getPasswordStrength(password.value) === 'weak') {
        setFieldError(password, 'La contraseña es débil. Combina mayúsculas, minúsculas, números y símbolos.');
        valid = false;
      } else {
        setFieldError(password, '');
      }
      updateStrengthMeter(password.value);
    }

    if (confirmar) {
      if (!confirmar.value) {
        setFieldError(confirmar, 'Confirma tu contraseña.');
        valid = false;
      } else if (password && confirmar.value !== password.value) {
        setFieldError(confirmar, 'Las contraseñas no coinciden.');
        valid = false;
      } else {
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
      updateStrengthMeter('');
    } else {
      feedback.textContent = 'Revisa los campos marcados en rojo.';
      feedback.classList.add('form-feedback--error');
      const firstInvalid = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
})();
