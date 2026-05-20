document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html#auth';
    return;
  }

  const info = document.getElementById('account-user-info');
  if (info) {
    const genderLabel = session.gender === 'female' ? 'женский' : 'мужской';
    info.innerHTML = `
      <p><strong>${session.lastName} ${session.firstName}</strong></p>
      <p>E-mail: ${session.email}</p>
      <p>Возраст: ${session.age || '—'} · Пол: ${genderLabel}</p>
      <p class="form-hint">Данные из регистрации. Тестовый пользователь: family@cosmos.ru</p>
    `;
  }

  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    window.location.href = 'index.html';
  });

  const form = document.getElementById('booking-form');
  const msg = document.getElementById('booking-message');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const excursion = form.excursion.value;
    const date = form.date.value;
    const time = form.time.value;
    const count = parseInt(form.count.value, 10);

    if (!excursion || !date || !time || !count || count < 1) {
      showMsg(msg, 'Заполните все поля записи.', 'error');
      return;
    }

    if (date !== '2024-07-08') {
      showMsg(msg, 'Доступна только дата: 8 июля 2024 г.', 'error');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('heroes-bookings') || '[]');
    bookings.push({
      email: session.email,
      excursion,
      date,
      time,
      count,
      at: new Date().toISOString()
    });
    localStorage.setItem('heroes-bookings', JSON.stringify(bookings));
    showMsg(msg, `Запись оформлена: «${excursion}», ${date}, ${time}, участников: ${count}.`, 'success');
    updateRouteStats();
  });
});

function showMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-message show ${type}`;
}

function updateRouteStats() {
  const bookings = JSON.parse(localStorage.getItem('heroes-bookings') || '[]');
  const total = bookings.reduce((s, b) => s + (b.count || 0), 0) + 127;
  document.querySelectorAll('[data-visitors]').forEach((el) => {
    el.textContent = total;
  });
}
