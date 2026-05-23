// login.js
// Script completo para login com LocalStorage.

const LOGIN_USER_KEY = 'app_logged_user';
const REGISTERED_USER_KEY = 'usuariosRegistrados';

function getRegisteredUser(email, senha) {
  const raw = localStorage.getItem(REGISTERED_USER_KEY);
  const usuarios = raw ? JSON.parse(raw) : [];
  return usuarios.find(usuario => usuario.email === email && usuario.senha === senha) || null;
}

function getLoggedUser() {
  const raw = localStorage.getItem(LOGIN_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveLoggedUser(user) {
  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(user));
}

function clearLoggedUser() {
  localStorage.removeItem(LOGIN_USER_KEY);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function login(email, senha) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const password = String(senha || '');

  if (!normalizedEmail || !password) {
    return { success: false, message: 'E-mail e senha são obrigatórios.' };
  }

  if (!validateEmail(normalizedEmail)) {
    return { success: false, message: 'E-mail inválido.' };
  }

  const registered = getRegisteredUser(normalizedEmail, password);
  if (!registered) {
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  const user = { email: normalizedEmail };
  saveLoggedUser(user);

  return { success: true, message: 'Login efetuado com sucesso.', user };
}

function logout() {
  clearLoggedUser();
  return { success: true, message: 'Logout realizado com sucesso.' };
}

function renderLoginState(options = {}) {
  const profileSelector = options.profileSelector || '#userNameDisplay';
  const messageSelector = options.messageSelector || '#loginMessage';
  const logoutSelector = options.logoutSelector || '#logoutButton';

  const profileElement = document.querySelector(profileSelector);
  const messageElement = document.querySelector(messageSelector);
  const logoutButton = document.querySelector(logoutSelector);
  const loggedUser = getLoggedUser();

  if (profileElement) {
    profileElement.textContent = loggedUser ? `Bem-vindo, ${loggedUser.email}` : 'Não conectado';
  }

  if (messageElement) {
    messageElement.textContent = loggedUser ? 'Você está conectado.' : 'Faça login para continuar.';
  }

  if (logoutButton) {
    logoutButton.style.display = loggedUser ? 'inline-block' : 'none';
  }
}

function connectLoginForm() {
  const formSelector = '#loginForm';
  const emailSelector = '#email';
  const passwordSelector = '#password';
  const messageSelector = '#loginMessage';
  const logoutSelector = '#logoutButton';

  const form = document.querySelector(formSelector);
  const emailInput = document.querySelector(emailSelector);
  const passwordInput = document.querySelector(passwordSelector);
  const messageElement = document.querySelector(messageSelector);
  const logoutButton = document.querySelector(logoutSelector);

  function showMessage(text) {
    if (messageElement) {
      messageElement.textContent = text;
    } else {
      alert(text);
    }
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const result = login(emailInput?.value, passwordInput?.value);
      showMessage(result.message);

      if (result.success) {
        form.reset();
        renderLoginState({ profileSelector: '#userNameDisplay', messageSelector: '#loginMessage', logoutSelector: '#logoutButton' });
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      const result = logout();
      showMessage(result.message);
      renderLoginState({ profileSelector: '#userNameDisplay', messageSelector: '#loginMessage', logoutSelector: '#logoutButton' });
    });
  }

  renderLoginState({ profileSelector: '#userNameDisplay', messageSelector: '#loginMessage', logoutSelector: '#logoutButton' });
}

const loggedUser = getLoggedUser();
if (loggedUser) {
  window.location.href = 'index.html';
}

const form = document.querySelector('#loginForm');
if (form) {
  connectLoginForm();
} else {
  console.warn('Formulário #loginForm não encontrado.');
}