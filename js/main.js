document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
    });
  }

  initHeroSlider();
  initReviewSlideset();
  initLoginForm();
  initHeroSearch();
  initSubscribeForm();
  updateNavForSession();
});

function initHeroSlider() {
  const track = document.querySelector('.slider-track');
  if (!track) return;
  const slides = track.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prev = document.querySelector('.slider-prev');
  const next = document.querySelector('.slider-next');
  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
  }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(index + 1), 7000);
}

function initReviewSlideset() {
  const cards = document.querySelectorAll('.review-card');
  if (cards.length < 2) return;
  let idx = 0;
  setInterval(() => {
    cards[idx].classList.remove('active');
    idx = (idx + 1) % cards.length;
    cards[idx].classList.add('active');
  }, 5000);
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const msg = document.getElementById('login-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    if (!isValidEmail(email)) {
      showMsg(msg, 'Введите корректный e-mail (должен содержать @ и домен).', 'error');
      return;
    }
    const result = login(email, password);
    if (result.ok) {
      showMsg(msg, 'Вход выполнен! Переход в личный кабинет…', 'success');
      setTimeout(() => { window.location.href = 'account.html'; }, 800);
    } else {
      showMsg(msg, result.message, 'error');
    }
  });
}

function initHeroSearch() {
  const form = document.getElementById('hero-search-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim().toLowerCase();
    const cards = document.querySelectorAll('.hero-card');
    let found = 0;
    cards.forEach((card) => {
      const name = card.dataset.surname?.toLowerCase() || '';
      const match = !q || name.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) found++;
    });
    const hint = document.getElementById('search-result');
    if (hint) {
      hint.textContent = q
        ? found
          ? `Найдено карточек: ${found}`
          : 'По вашему запросу ничего не найдено.'
        : '';
    }
  });
}

function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;
  const msg = document.getElementById('subscribe-message');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value;
    const consent = form.consent.checked;
    if (!email) {
      showMsg(msg, 'Укажите e-mail.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showMsg(msg, 'Некорректный e-mail.', 'error');
      return;
    }
    if (!consent) {
      showMsg(msg, 'Необходимо согласие на обработку персональных данных.', 'error');
      return;
    }
    showMsg(msg, 'Спасибо! Вы подписаны на новости.', 'success');
    form.reset();
  });
}

function updateNavForSession() {
  const session = getSession();
  const regLink = document.querySelector('.nav-reg');
  if (session && regLink) regLink.style.display = 'none';
}

function showMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-message show ${type}`;
}
