const titleInput   = document.getElementById('tab-title');
const contentInput = document.getElementById('tab-content');
const addBtn       = document.getElementById('add-tab');
const saveBtn      = document.getElementById('save-all');
const listWrap     = document.getElementById('list');
const statusEl     = document.getElementById('status');

let tabs = [];

function renderList() {
  listWrap.innerHTML = '';
  tabs.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.flex = '1 1 260px';
    card.innerHTML = `
      <strong>${i + 1}. ${t.title || '(без назви)'}</strong>
      <div class="row" style="margin-top:8px">
        <button data-act="up" data-i="${i}">Вгору</button>
        <button data-act="down" data-i="${i}">Вниз</button>
        <button class="danger" data-act="del" data-i="${i}">Видалити</button>
      </div>
      <div class="small" style="margin-top:6px; max-width:520px; white-space:pre-wrap;">${t.content}</div>
    `;
    listWrap.appendChild(card);
  });
}

addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) {
    statusEl.textContent = 'Заповни і заголовок, і контент.';
    return;
  }
  tabs.push({ title, content });
  titleInput.value = '';
  contentInput.value = '';
  renderList();
  statusEl.textContent = 'Вкладку додано.';
});

listWrap.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const act = btn.dataset.act;
  if (act === 'del') tabs.splice(i, 1);
  if (act === 'up' && i > 0) [tabs[i-1], tabs[i]] = [tabs[i], tabs[i-1]];
  if (act === 'down' && i < tabs.length - 1) [tabs[i+1], tabs[i]] = [tabs[i], tabs[i+1]];
  renderList();
});

saveBtn.addEventListener('click', async () => {
  statusEl.textContent = 'Збереження...';
  try {
    const res = await fetch('api/save_tabs.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tabs })
    });
    const data = await res.json();
    statusEl.textContent = data.ok ? 'Збережено.' : ('Помилка: ' + (data.error || 'невідома'));
  } catch (err) {
    statusEl.textContent = 'Помилка мережі.';
  }
});
