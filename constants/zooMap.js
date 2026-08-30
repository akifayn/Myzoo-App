// MyZoo bahçe planı — kurgusal harita verisi
// Koordinat uzayı: 1000 x 1300 (viewBox). 1 birim ≈ 0.4 metre kabul edilir.

export const MAP_W = 1000;
export const MAP_H = 1300;
export const METERS_PER_UNIT = 0.4;
export const WALK_SPEED_MPS = 1.2; // ortalama yürüyüş hızı

// ── Tematik bölgeler ───────────────────────────────────────────────────────────
export const ZONES = [
  {
    id: 'savan',
    name: 'Savan',
    x: 60, y: 60, w: 400, h: 370,
    fill: '#EAD9A8', stroke: '#C9A94E',
  },
  {
    id: 'orman',
    name: 'Orman',
    x: 550, y: 60, w: 390, h: 420,
    fill: '#C2DDB9', stroke: '#7BA974',
  },
  {
    id: 'primat',
    name: 'Primat Vadisi',
    x: 60, y: 490, w: 330, h: 260,
    fill: '#D8E2A4', stroke: '#A3B75C',
  },
  {
    id: 'su',
    name: 'Su Dünyası',
    x: 560, y: 530, w: 380, h: 290,
    fill: '#C3E2EC', stroke: '#7FB6D9',
  },
  {
    id: 'kutup',
    name: 'Kutup',
    x: 60, y: 810, w: 310, h: 220,
    fill: '#DFEBF4', stroke: '#A6C6DD',
  },
  {
    id: 'kanat',
    name: 'Kanatlılar & Gece Evi',
    x: 620, y: 860, w: 320, h: 210,
    fill: '#E8D8E5', stroke: '#B48EAE',
  },
];

// ── Yürüyüş yolu ağı (graf düğümleri) ─────────────────────────────────────────
export const NODES = {
  giris:    { x: 500, y: 1240 },
  meydan:   { x: 500, y: 1100 },
  w1:       { x: 300, y: 1040 },
  kutup:    { x: 215, y: 915 },
  primatS:  { x: 240, y: 770 },
  primat:   { x: 225, y: 610 },
  savanS:   { x: 245, y: 455 },
  savan:    { x: 260, y: 300 },
  savanN:   { x: 300, y: 130 },
  merkez:   { x: 500, y: 930 },
  gol:      { x: 490, y: 720 },
  ormanS:   { x: 700, y: 490 },
  orman:    { x: 745, y: 300 },
  ormanN:   { x: 720, y: 130 },
  e1:       { x: 700, y: 1050 },
  kus:      { x: 780, y: 960 },
  su:       { x: 690, y: 665 },
  suE:      { x: 865, y: 645 },
};

// Kenarlar (çift yönlü)
export const EDGES = [
  ['giris', 'meydan'],
  ['meydan', 'w1'],
  ['meydan', 'e1'],
  ['meydan', 'merkez'],
  ['w1', 'kutup'],
  ['kutup', 'primatS'],
  ['primatS', 'primat'],
  ['primat', 'savanS'],
  ['savanS', 'savan'],
  ['savan', 'savanN'],
  ['savanN', 'ormanN'],
  ['ormanN', 'orman'],
  ['orman', 'ormanS'],
  ['ormanS', 'su'],
  ['su', 'suE'],
  ['suE', 'kus'],
  ['kus', 'e1'],
  ['merkez', 'gol'],
  ['gol', 'su'],
  ['gol', 'savanS'],
  ['merkez', 'w1'],
];

// ── Hayvan yerleşimleri ───────────────────────────────────────────────────────
// Anahtar: küçük harfe çevrilmiş hayvan adı (Türkçe karakterler korunur)
export const ENCLOSURES = {
  // Savan
  'aslan':               { x: 170, y: 190, zone: 'Savan', emoji: '🦁', node: 'savan' },
  'zürafa':              { x: 380, y: 140, zone: 'Savan', emoji: '🦒', node: 'savanN' },
  'fil':                 { x: 150, y: 350, zone: 'Savan', emoji: '🐘', node: 'savan' },
  'sırtlan':             { x: 385, y: 330, zone: 'Savan', emoji: '🐺', node: 'savanS' },
  // Orman
  'kaplan':              { x: 630, y: 150, zone: 'Orman', emoji: '🐯', node: 'ormanN' },
  'ayı':                 { x: 865, y: 165, zone: 'Orman', emoji: '🐻', node: 'orman' },
  'panda':               { x: 745, y: 235, zone: 'Orman', emoji: '🐼', node: 'orman' },
  'rakun':               { x: 630, y: 360, zone: 'Orman', emoji: '🦝', node: 'ormanS' },
  'yılan':               { x: 865, y: 370, zone: 'Orman', emoji: '🐍', node: 'orman' },
  'tilki':               { x: 745, y: 430, zone: 'Orman', emoji: '🦊', node: 'ormanS' },
  // Primat Vadisi
  'maymun':              { x: 150, y: 560, zone: 'Primat Vadisi', emoji: '🐵', node: 'primat' },
  'orangutan':           { x: 310, y: 660, zone: 'Primat Vadisi', emoji: '🦧', node: 'primatS' },
  // Su Dünyası
  'yunus':               { x: 645, y: 590, zone: 'Su Dünyası', emoji: '🐬', node: 'su' },
  'timsah':              { x: 865, y: 575, zone: 'Su Dünyası', emoji: '🐊', node: 'suE' },
  'deniz kaplumbağası':  { x: 640, y: 755, zone: 'Su Dünyası', emoji: '🐢', node: 'su' },
  'kurbağa':             { x: 870, y: 745, zone: 'Su Dünyası', emoji: '🐸', node: 'suE' },
  // Kutup
  'penguen':             { x: 145, y: 880, zone: 'Kutup', emoji: '🐧', node: 'kutup' },
  'kutup ayısı':         { x: 290, y: 960, zone: 'Kutup', emoji: '🐻‍❄️', node: 'kutup' },
  // Kanatlılar & Gece Evi
  'kartal':              { x: 700, y: 920, zone: 'Kanatlılar & Gece Evi', emoji: '🦅', node: 'kus' },
  'yarasa':              { x: 865, y: 910, zone: 'Kanatlılar & Gece Evi', emoji: '🦇', node: 'kus' },
  'bukalemun':           { x: 785, y: 1015, zone: 'Kanatlılar & Gece Evi', emoji: '🦎', node: 'kus' },
};

// Haritada tanımı olmayan (sonradan eklenen) hayvanlar için yedek noktalar
export const FALLBACK_SPOTS = [
  { x: 420, y: 860, zone: 'Meydan', emoji: '🐾', node: 'merkez' },
  { x: 580, y: 880, zone: 'Meydan', emoji: '🐾', node: 'merkez' },
  { x: 420, y: 1010, zone: 'Meydan', emoji: '🐾', node: 'meydan' },
  { x: 580, y: 1010, zone: 'Meydan', emoji: '🐾', node: 'meydan' },
];

// ── Tesisler ──────────────────────────────────────────────────────────────────
export const FACILITIES = [
  { name: 'Giriş', x: 500, y: 1258, icon: '🎪' },
  { name: 'Kafe', x: 395, y: 950, icon: '☕' },
  { name: 'WC', x: 610, y: 1145, icon: '🚻' },
  { name: 'İlk Yardım', x: 390, y: 1145, icon: '⛑️' },
];

// Göl süsü
export const LAKE = { cx: 480, cy: 715, rx: 85, ry: 52 };

// Ağaç süsleri (dekoratif)
export const TREES = [
  { x: 480, y: 90 }, { x: 500, y: 250 }, { x: 470, y: 400 },
  { x: 90, y: 460 }, { x: 420, y: 550 }, { x: 100, y: 770 },
  { x: 430, y: 790 }, { x: 940, y: 500 }, { x: 90, y: 1060 },
  { x: 180, y: 1120 }, { x: 830, y: 1120 }, { x: 920, y: 830 },
  { x: 560, y: 480 }, { x: 350, y: 870 },
];

// ── Yardımcılar ───────────────────────────────────────────────────────────────

export const normalizeName = (name) =>
  (name || '').toLocaleLowerCase('tr-TR').trim();

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Komşuluk listesi (bir kez kurulur)
const buildAdjacency = () => {
  const adj = {};
  Object.keys(NODES).forEach((id) => { adj[id] = []; });
  EDGES.forEach(([a, b]) => {
    const w = dist(NODES[a], NODES[b]);
    adj[a].push({ to: b, w });
    adj[b].push({ to: a, w });
  });
  return adj;
};
const ADJ = buildAdjacency();

// Verilen noktaya en yakın yol düğümü
export const nearestNode = (point) => {
  let best = null;
  let bestD = Infinity;
  Object.entries(NODES).forEach(([id, pos]) => {
    const d = dist(point, pos);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  });
  return best;
};

// Dijkstra — startId'den endId'ye düğüm kimlikleri listesi döner
export const shortestPath = (startId, endId) => {
  const distances = {};
  const prev = {};
  const visited = new Set();
  Object.keys(NODES).forEach((id) => { distances[id] = Infinity; });
  distances[startId] = 0;

  while (true) {
    // Ziyaret edilmemiş en yakın düğüm
    let current = null;
    let currentD = Infinity;
    Object.entries(distances).forEach(([id, d]) => {
      if (!visited.has(id) && d < currentD) {
        current = id;
        currentD = d;
      }
    });
    if (current === null || current === endId) break;
    visited.add(current);

    ADJ[current].forEach(({ to, w }) => {
      if (visited.has(to)) return;
      const nd = currentD + w;
      if (nd < distances[to]) {
        distances[to] = nd;
        prev[to] = current;
      }
    });
  }

  if (distances[endId] === Infinity) return null;
  const path = [endId];
  while (path[0] !== startId) {
    path.unshift(prev[path[0]]);
  }
  return path;
};

// Kullanıcı konumundan hedef noktaya tam rota: [{x,y}, ...] + mesafe (metre)
export const buildRoute = (fromPoint, toEnclosure) => {
  const startNode = nearestNode(fromPoint);
  const endNode = toEnclosure.node || nearestNode(toEnclosure);
  const nodePath = shortestPath(startNode, endNode);
  if (!nodePath) return null;

  const points = [
    { x: fromPoint.x, y: fromPoint.y },
    ...nodePath.map((id) => NODES[id]),
    { x: toEnclosure.x, y: toEnclosure.y },
  ];

  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += dist(points[i - 1], points[i]);
  }

  const meters = Math.round(total * METERS_PER_UNIT);
  const minutes = Math.max(1, Math.round(meters / WALK_SPEED_MPS / 60));
  return { points, meters, minutes };
};
