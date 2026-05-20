document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const registerBtn = document.getElementById('register-btn');
  const pdConsent = document.getElementById('pd-consent');
  const msg = document.getElementById('reg-message');

  if (!form || !registerBtn) return;

  function updateRegisterButton() {
    registerBtn.disabled = !pdConsent.checked;
  }

  pdConsent.addEventListener('change', updateRegisterButton);
  updateRegisterButton();

  form.addEventListener('input', () => validatePreview(form));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = validateRegistration(form);
    showRegMessage(msg, result.message, result.type);

    if (!result.valid) return;

    const user = {
      email: form.email.value.trim(),
      password: form.password.value,
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      age: parseInt(form.ageNumber.value, 10) || parseInt(form.ageRange.value, 10),
      gender: form.gender.value,
      registeredAt: new Date().toISOString().slice(0, 10)
    };

    const reg = registerUser(user);
    if (reg.ok) {
      showRegMessage(msg, reg.message + ' Войдите на главной странице.', 'success');
      form.reset();
      updateRegisterButton();
    } else {
      showRegMessage(msg, reg.message, 'error');
    }
  });
});

function validatePreview(form) {
  const email = form.email?.value || '';
  const emailHint = document.getElementById('email-hint');
  if (emailHint) {
    if (!email) emailHint.textContent = '';
    else if (isValidEmail(email)) emailHint.textContent = '✓ E-mail указан корректно';
    else emailHint.textContent = '✗ Укажите e-mail в формате name@domain.ru';
    emailHint.style.color = isValidEmail(email) ? 'var(--success)' : 'var(--error)';
  }
}

function validateRegistration(form) {
  const required = [
    'email', 'firstName', 'lastName', 'password', 'password2', 'gender'
  ];

  for (const name of required) {
    const el = form[name];
    if (!el || (el.type === 'radio' && !form.querySelector(`input[name="${name}"]:checked`))) {
      if (el?.type !== 'radio' && (!el || !String(el.value).trim())) {
        return { valid: false, type: 'error', message: 'Заполните все обязательные поля.' };
      }
    }
    if (el && el.type !== 'radio' && el.hasAttribute('required') && !String(el.value).trim()) {
      return { valid: false, type: 'error', message: 'Заполните все обязательные поля.' };
    }
  }

  const genderChecked = form.querySelector('input[name="gender"]:checked');
  if (!genderChecked) {
    return { valid: false, type: 'error', message: 'Укажите пол.' };
  }

  if (!isValidEmail(form.email.value)) {
    return { valid: false, type: 'error', message: 'Некорректный e-mail. Адрес должен содержать символ @ и домен (например, user@mail.ru).' };
  }

  const ageNum = parseInt(form.ageNumber.value, 10);
  const ageRange = parseInt(form.ageRange.value, 10);
  if ((!ageNum || ageNum < 1) && (!ageRange || ageRange < 1)) {
    return { valid: false, type: 'error', message: 'Укажите возраст (числом или из списка).' };
  }

  if (form.password.value.length < 6) {
    return { valid: false, type: 'error', message: 'Пароль должен быть не менее 6 символов.' };
  }

  if (form.password.value !== form.password2.value) {
    return { valid: false, type: 'error', message: 'Пароли не совпадают.' };
  }

  if (!form.pdConsent.checked) {
    return { valid: false, type: 'error', message: 'Необходимо согласие на обработку персональных данных.' };
  }

  const photo = form.photo?.files?.[0];
  if (!photo) {
    return { valid: false, type: 'error', message: 'Загрузите семейную фотографию.' };
  }

  return { valid: true, type: 'success', message: 'Данные корректны. Регистрация…' };
}

function showRegMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-message show ${type}`;
}

// Demo states for assignment screenshots
function showValidationDemo(state) {
  const msg = document.getElementById('reg-message');
  const texts = {
    success: 'Все поля заполнены корректно. Регистрация возможна.',
    error: 'Ошибка: проверьте e-mail, пароли и обязательные поля.',
    empty: 'Заполните все обязательные поля.'
  };
  showRegMessage(msg, texts[state] || texts.error, state === 'success' ? 'success' : 'error');
}
