(function () {
  const STORAGE_KEY = 'heroes-theme';
  const html = document.documentElement;

  function getPreferred() {
    if (document.body.classList.contains('theme-light-page')) return 'light';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.textContent = theme === 'dark' ? '☀ Светлая' : '🌙 Тёмная';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
    });
  }

  applyTheme(getPreferred());

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
})();
