const statusEl = document.getElementById('viewer-status');
const root = document.getElementById('tabs-root');
let lastVersion = null;

function buildTabs(tabs) {
  root.innerHTML = '';
  if (!tabs || !tabs.length) {
    root.innerHTML = '<p class="small">Немає вкладок. Додай їх на сторінці 1.</p>';
    return;
  }
  const nav = document.createElement('div');
  nav.className = 'tabs-nav';
  nav.setAttribute('role', 'tablist');

  const panelsWrap = document.createElement('div');
  tabs.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = t.title;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.dataset.target = 'panel-' + i;
    nav.appendChild(btn);

    const panel = document.createElement('section');
    panel.id = 'panel-' + i;
    panel.className = 'tab-panel' + (i === 0 ? ' active' : '');
    panel.setAttribute('role', 'tabpanel');
    panel.innerHTML = t.content;
    panelsWrap.appendChild(panel);
  });

  root.appendChild(nav);
  root.appendChild(panelsWrap);

  nav.addEventListener('click', (e) => {
    const b = e.target.closest('button[role="tab"]');
    if (!b) return;
    const id = b.dataset.target;
    nav.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', 'false'));
    b.setAttribute('aria-selected', 'true');
    panelsWrap.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const active = panelsWrap.querySelector('#' + id);
    if (active) active.classList.add('active');
  });
}

async function loadData() {
  try {
    const res = await fetch('api/get_tabs.php?ts=' + Date.now());
    const data = await res.json();
    if (!data.ok) {
      statusEl.textContent = 'Помилка завантаження.';
      return;
    }
    if (lastVersion !== data.version) {
      buildTabs(data.tabs);
      lastVersion = data.version;
      statusEl.textContent = 'Оновлено: ' + new Date(data.version * 1000).toLocaleString();
    }
  } catch (e) {
    statusEl.textContent = 'Немає звʼязку із сервером.';
  }
}

loadData();
setInterval(loadData, 5000);
