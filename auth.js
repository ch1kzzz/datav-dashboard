/* === Auth Config === */
const AUTH_CREDENTIALS = { user: 'admin', pass: 'Autel123' };
const AUTH_KEY = 'datav_auth_token';

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('loginError');

  if (user === AUTH_CREDENTIALS.user && pass === AUTH_CREDENTIALS.pass) {
    sessionStorage.setItem(AUTH_KEY, '1');
    hideLogin();
  } else {
    errorEl.textContent = '账号或密码错误';
    errorEl.style.opacity = '1';
  }
}

function hideLogin() {
  const overlay = document.getElementById('loginOverlay');
  if (overlay) overlay.style.display = 'none';
}

function showLogin() {
  const overlay = document.getElementById('loginOverlay');
  if (overlay) overlay.style.display = 'flex';
}

/* === Init === */
if (isAuthenticated()) {
  hideLogin();
} else {
  showLogin();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('loginBtn');
  const passInput = document.getElementById('loginPass');
  const userInput = document.getElementById('loginUser');

  if (btn) btn.addEventListener('click', doLogin);
  if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  if (userInput) userInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});
