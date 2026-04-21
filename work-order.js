/* === Default Seed Data === */
const SEED = [
  {
    device: '大疆 M300 RTK',
    location: 'G94 珠三角环线高速 K38+200~K39+000',
    type: '路面裂缝',
    coord: '113.5628°E, 23.1245°N',
    reporter: '陈巡检',
    time: '2026-04-21 08:42',
    severity: '一般',
    desc: '行车道出现纵向裂缝，长度约 6.2m，暂未影响通行'
  },
  {
    device: '大疆 M30T',
    location: 'G4 京港澳高速 K128+500',
    type: '护栏破损',
    coord: '113.6102°E, 23.1567°N',
    reporter: '李航测',
    time: '2026-04-21 09:15',
    severity: '较重',
    desc: '右侧波形护栏变形脱落 3 节，存在安全隐患'
  },
  {
    device: '大疆 Mavic 3 Enterprise',
    location: 'S20 广深沿江高速 K52+100',
    type: '路面坑槽',
    coord: '113.4983°E, 23.0892°N',
    reporter: '王运维',
    time: '2026-04-21 10:03',
    severity: '严重',
    desc: '快车道出现深度约 8cm 坑槽，易引发车辆颠簸失控'
  },
  {
    device: '大疆 Matrice 350 RTK',
    location: 'G15 沈海高速 K206+800',
    type: '边坡滑坡',
    coord: '113.7025°E, 23.1831°N',
    reporter: '张巡查',
    time: '2026-04-21 11:20',
    severity: '重大',
    desc: '右侧边坡局部土体滑落，覆盖应急车道 1/3 路面'
  },
  {
    device: '大疆 M300 RTK',
    location: 'G9411 莞佛高速 K77+300',
    type: '标志牌倾斜',
    coord: '113.5217°E, 23.1046°N',
    reporter: '刘检测',
    time: '2026-04-21 14:18',
    severity: '较重',
    desc: '限速指示牌倾斜约 15°，存在倒伏风险'
  },
  {
    device: '大疆 Mavic 3E',
    location: 'G4W 广乐高速 K182+000',
    type: '路面沉降',
    coord: '113.6559°E, 23.1673°N',
    reporter: '黄飞控',
    time: '2026-04-21 15:32',
    severity: '一般',
    desc: '路面轻微不均匀沉降，长度约 12m，无明显积水'
  },
  {
    device: '大疆 M30T',
    location: 'S81 广州绕城高速 K66+700',
    type: '隔离带杂物',
    coord: '113.4762°E, 23.0758°N',
    reporter: '周巡检',
    time: '2026-04-21 16:05',
    severity: '轻微',
    desc: '中央隔离带堆积塑料袋、树枝等漂浮垃圾'
  },
  {
    device: '大疆 Matrice 350 RTK',
    location: 'G55 二广高速 K261+200',
    type: '路面鼓包',
    coord: '113.6890°E, 23.1924°N',
    reporter: '吴测绘',
    time: '2026-04-21 16:58',
    severity: '较重',
    desc: '行车道局部沥青鼓包，高度约 5cm，影响行车平顺性'
  }
];

/* === localStorage Persistence === */
const STORAGE_KEY = 'datav_work_orders';

function loadOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [...SEED];
  } catch {
    return [...SEED];
  }
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

const orders = loadOrders();
let currentPage = 1;

/* === Severity Styles === */
const severityClass = {
  '轻微': 'severity-minor',
  '一级': 'severity-minor',
  '一般': 'severity-normal',
  '二级': 'severity-moderate',
  '较重': 'severity-moderate',
  '严重': 'severity-severe',
  '三级': 'severity-severe',
  '重大': 'severity-critical'
};

/* === Dynamic Page Size === */
function calcPageSize() {
  const wrap = document.querySelector('.table-wrap');
  if (!wrap) return 5;
  const thead = document.querySelector('.wo-table thead');
  const headH = thead ? thead.offsetHeight : 40;
  const available = wrap.clientHeight - headH;
  const rowH = 46;
  return Math.max(1, Math.floor(available / rowH));
}

let pageSize = calcPageSize();

/* === Render === */
function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const pageData = orders.slice(start, start + pageSize);
  const tbody = document.getElementById('woBody');

  tbody.innerHTML = pageData.map((o, i) => `
    <tr>
      <td>${start + i + 1}</td>
      <td>${o.device}</td>
      <td>${o.location}</td>
      <td>${o.type}</td>
      <td>${o.coord}</td>
      <td>${o.reporter}</td>
      <td>${o.time}</td>
      <td><span class="severity ${severityClass[o.severity] || 'severity-normal'}">${o.severity}</span></td>
      <td>${o.desc}</td>
    </tr>
  `).join('');
}

function renderPagination() {
  const total = Math.max(1, Math.ceil(orders.length / pageSize));
  if (currentPage > total) currentPage = total;
  const container = document.getElementById('pagination');

  const prevDisabled = currentPage <= 1 ? ' disabled' : '';
  const nextDisabled = currentPage >= total ? ' disabled' : '';

  let pages = '';
  for (let i = 1; i <= total; i++) {
    pages += `<span class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</span>`;
  }

  container.innerHTML = `
    <span class="page-btn${prevDisabled}" data-page="${currentPage - 1}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
    </span>
    ${pages}
    <span class="page-btn${nextDisabled}" data-page="${currentPage + 1}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </span>
    <span class="page-info">共 ${orders.length} 条</span>
  `;
}

document.getElementById('pagination').addEventListener('click', e => {
  const btn = e.target.closest('.page-btn');
  if (!btn || btn.classList.contains('disabled')) return;
  currentPage = Number(btn.dataset.page);
  renderTable();
  renderPagination();
});

/* === Modal Controls === */
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');
const cancelBtn = document.getElementById('btnCancel');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const woForm = document.getElementById('woForm');

document.getElementById('addBtn').addEventListener('click', () => {
  overlay.classList.add('open');
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  woForm.querySelector('input[name="date"]').value = dateStr;
  woForm.querySelector('input[name="time"]').value = timeStr;
});

function closeModal() {
  overlay.classList.remove('open');
  woForm.reset();
  uploadPreview.innerHTML = '';
  uploadPlaceholder.style.display = '';
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
  e.stopPropagation();
});

/* === File Upload Preview === */
uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  uploadPreview.innerHTML = '';
  const files = fileInput.files;
  if (files.length) uploadPlaceholder.style.display = 'none';
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      uploadPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

/* === Form Submit === */
woForm.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(woForm);
  const timeVal = fd.get('time');
  const formattedTime = fd.get('date') && timeVal ? `${fd.get('date')} ${timeVal}` : '';

  orders.unshift({
    device: fd.get('device'),
    location: fd.get('location'),
    type: fd.get('type'),
    coord: fd.get('coord'),
    reporter: fd.get('reporter'),
    time: formattedTime,
    severity: fd.get('severity'),
    desc: fd.get('desc')
  });

  saveOrders();
  currentPage = 1;
  renderTable();
  renderPagination();
  closeModal();
});

/* === Resize: recalc page size === */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newSize = calcPageSize();
    if (newSize !== pageSize) {
      pageSize = newSize;
      currentPage = 1;
      renderTable();
      renderPagination();
    }
  }, 200);
});

/* === Init === */
renderTable();
renderPagination();
