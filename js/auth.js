/** RepairFlow V11 authentication — verified by Cloudflare Worker (not frontend passwords). */
import { CONFIG } from './config.js';
const KEY = 'repairflow-v11-session';
export const demoAccounts = {};
export function getDemoSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (!session?.token || session.expiresAt <= Date.now()) return null;
    return session;
  } catch { return null; }
}
export function signOutDemo() { sessionStorage.removeItem(KEY); }
export async function signInDemo(email, password) {
  const response = await fetch(`${CONFIG.API_BASE_URL.replace(/\/$/, '')}/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email, password})
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.token) throw new Error(body.error || 'Đăng nhập thất bại.');
  const session = {token:body.token, email:body.email,name:body.name,role:body.role,expiresAt:Date.now()+11*60*60*1000};
  sessionStorage.setItem(KEY,JSON.stringify(session));
  return session;
}
if (document.getElementById('login-form')) {
  if (getDemoSession()) window.location.replace('./index.html');
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = document.getElementById('login-submit');
    const error = document.getElementById('login-error');
    button.disabled = true;
    error.hidden = true;
    try {
      await signInDemo(document.getElementById('login-email').value.trim(),document.getElementById('login-password').value);
      window.location.replace('./index.html');
    } catch (err) {error.hidden=false;error.textContent=err.message;} finally {button.disabled=false;}
  });
  document.querySelectorAll('[data-demo-account]').forEach(button=>button.remove());
  document.querySelectorAll('.login-demo').forEach(element=>element.remove());
  document.getElementById('login-password-visibility')?.addEventListener('click', () => {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
  });
}
