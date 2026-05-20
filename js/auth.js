const AUTH_STORAGE = 'heroes-users';
const SESSION_KEY = 'heroes-session';

const DEFAULT_USER = {
  email: 'family@cosmos.ru',
  password: 'Heroes2024!',
  firstName: 'Алексей',
  lastName: 'Петров',
  age: 42,
  gender: 'male',
  registeredAt: '2024-05-01'
};

function getUsers() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE);
    const list = raw ? JSON.parse(raw) : [];
    const hasDefault = list.some((u) => u.email.toLowerCase() === DEFAULT_USER.email.toLowerCase());
    if (!hasDefault) {
      list.unshift(DEFAULT_USER);
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(list));
    }
    return list;
  } catch {
    return [DEFAULT_USER];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE, JSON.stringify(users));
}

function registerUser(user) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, message: 'Пользователь с таким e-mail уже зарегистрирован.' };
  }
  users.push(user);
  saveUsers(users);
  return { ok: true, message: 'Регистрация успешна! Теперь вы можете войти.' };
}

function login(email, password) {
  const users = getUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!found) {
    return { ok: false, message: 'Неверный e-mail или пароль.' };
  }
  const session = {
    email: found.email,
    firstName: found.firstName,
    lastName: found.lastName,
    age: found.age,
    gender: found.gender
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).trim());
}

if (typeof module !== 'undefined') module.exports = { getUsers, registerUser, login, getSession, logout, isValidEmail, DEFAULT_USER };
