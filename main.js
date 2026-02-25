/**
 * Rodina Moskva — логика страницы: частицы, меню, расписание, модалка, reveal, параллакс.
 */

// URL API регистрации (бэкенд должен быть запущен: node server/index.js)
const API_BASE = 'http://localhost:3001';

// Текущий матч при открытии модалки (для отправки в API)
let currentMatchLabel = '';

// --- PARTICLE CANVAS ---
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -Math.random() * 0.8 - 0.2;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
    this.size = Math.random() * 2 + 0.5;
    this.isLine = Math.random() > 0.7;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life * 0.6;
    if (this.isLine) {
      ctx.strokeStyle = `rgba(232,0,29,${this.life * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 40, this.y + this.vy * 40);
      ctx.stroke();
    } else {
      ctx.fillStyle = this.life > 0.5 ? `rgba(232,0,29,${this.life * 0.8})` : `rgba(255,255,255,${this.life})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(10,10,10,0.15)';
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - d / 100) * 0.1;
        ctx.strokeStyle = 'rgba(232,0,29,1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// --- MOBILE MENU ---
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// --- SCHEDULE DATA & RENDER ---
const matches = [
  { date: '18 янв', day: '18', month: 'ЯНВ', year: '2026', time: '16:30', home: 'Орион', away: 'Rodina Moskva', venue: 'м. Каширская', home_team: false, past: true },
  { date: '28 янв', day: '28', month: 'ЯНВ', year: '2026', time: '19:00', home: 'ГРК', away: 'Rodina Moskva', venue: 'м. Шоссе Энтузиастов', home_team: false, past: true },
  { date: '31 янв', day: '31', month: 'ЯНВ', year: '2026', time: '17:00', home: 'Rodina Moskva', away: 'SV ÄLSKA', venue: 'м. Парк Победы (АПЛ)', home_team: true, past: true },
  { date: '07 фев', day: '07', month: 'ФЕВ', year: '2026', time: '10:00', home: 'Вин-Таж', away: 'Rodina Moskva', venue: 'м. Курская', home_team: false, past: true },
  { date: '14 фев', day: '14', month: 'ФЕВ', year: '2026', time: '17:00', home: 'Rodina Moskva', away: 'РУДН', venue: 'м. Парк Победы (АПЛ)', home_team: true, past: true },
  { date: '17 фев', day: '17', month: 'ФЕВ', year: '2026', time: '20:00', home: 'MIOFROM (жен)', away: 'Rodina Moskva', venue: 'м. Сокол', home_team: false, past: true },
  { date: '14 мар', day: '14', month: 'МАР', year: '2026', time: '17:00', home: 'Rodina Moskva', away: 'Локомотив', venue: 'м. Парк Победы (АПЛ)', home_team: true, past: false },
  { date: '21 мар', day: '21', month: 'МАР', year: '2026', time: '17:00', home: 'Rodina Moskva', away: 'Первый ДСК (жен)', venue: 'м. Парк Победы (АПЛ)', home_team: true, past: false },
  { date: '28 мар', day: '28', month: 'МАР', year: '2026', time: '20:00', home: 'Аврора', away: 'Rodina Moskva', venue: 'м. Сокол', home_team: false, past: false },
];

function renderMatchCards() {
  const container = document.getElementById('matchCards');
  if (!container) return;
  matches.forEach((m, i) => {
    const homeName = m.home_team ? `<span class="match-home">${m.home}</span>` : `<span>${m.home}</span>`;
    const awayName = !m.home_team ? `<span class="match-home">${m.away}</span>` : `<span>${m.away}</span>`;
    const isPast = m.past;
    const matchLabel = `${m.home} — ${m.away}, ${m.day} ${m.month} ${m.time}`;
    container.innerHTML += `
    <div class="match-card reveal" style="transition-delay:${i * 0.06}s;opacity:${isPast ? '0.45' : '1'}">
      <div class="match-date-block">
        <div class="match-day">${m.day}</div>
        <div class="match-month">${m.month}</div>
      </div>
      <div class="match-info">
        <div class="match-teams">${homeName} <span style="color:var(--text-muted)">—</span> ${awayName}</div>
        <div class="match-meta">
          <span>🕐 ${m.time}</span>
          <span>📍 ${m.venue}</span>
          ${m.home_team ? '<span style="color:var(--red)">🏠 Домашний</span>' : ''}
          ${isPast ? '<span style="color:#555">Завершён</span>' : ''}
        </div>
      </div>
      <div class="match-action">
        ${!isPast ? `<button class="btn-primary" onclick="openModal('${matchLabel.replace(/'/g, "\\'")}')">Записаться</button>` : `<span style="font-size:11px;letter-spacing:2px;color:#333;text-transform:uppercase">Завершён</span>`}
      </div>
    </div>`;
  });
}
renderMatchCards();

// --- MODAL ---
function openModal(matchName) {
  currentMatchLabel = matchName || '';
  document.getElementById('modalMatchName').textContent = matchName;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('successMsg').style.display = 'none';
  ['fieldName', 'fieldSurname', 'fieldPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('modalContent').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

async function submitForm() {
  const name = (document.getElementById('fieldName') && document.getElementById('fieldName').value || '').trim();
  const surname = (document.getElementById('fieldSurname') && document.getElementById('fieldSurname').value || '').trim();
  const phone = (document.getElementById('fieldPhone') && document.getElementById('fieldPhone').value || '').trim();
  if (!name || !surname || !phone) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  if (!currentMatchLabel) {
    alert('Не указана игра. Закройте окно и нажмите «Записаться» на нужном матче.');
    return;
  }

  const submitBtn = document.querySelector('#modalContent .btn-primary');
  const originalText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка…';
  }

  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        surname,
        phone,
        match_label: currentMatchLabel,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = (data.errors && data.errors.length) ? data.errors.join('. ') : 'Ошибка отправки. Попробуйте позже.';
      alert(msg);
      return;
    }

    document.getElementById('modalContent').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
    setTimeout(() => {
      closeModal();
      const msg = document.getElementById('successMsg');
      if (msg) msg.style.display = 'none';
    }, 3000);
  } catch (err) {
    alert('Нет связи с сервером. Убедитесь, что бэкенд запущен (node server/index.js), и попробуйте снова.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

// --- SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));

// --- PARALLAX ---
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.photo-card').forEach((el, i) => {
    el.style.transform = `translateY(${sy * (i % 2 === 0 ? 0.05 : -0.05)}px)`;
  });
});

// Экспорт для onclick в HTML
window.toggleMenu = toggleMenu;
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;
