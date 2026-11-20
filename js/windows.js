(function () {
  const wins = new Map();
  const MOBILE_BREAKPOINT = 640;
  const EDGE_GAP = 8;
  const DOCK_GAP = 8;
  const MIN_ROOM = 160;
  const STAGGER = 10;
  let topZ = 10;
  let spawned = 0;

  const layer = () => document.getElementById('windows');

  const promptHead = (dir) => [
    h('span', { class: 'p-user' }, PORTFOLIO.owner.handle + '@' + PORTFOLIO.owner.host),
    h('span', { class: 'p-dir' }, ':' + dir),
    h('span', { class: 'p-sign' }, '$ '),
  ];

  function addPrompts(body, dir, cmd) {
    const typed = h('span', { class: 'p-cmd', style: `--n:${cmd.length}` }, cmd);
    body.prepend(h('div', { class: 'prompt' }, promptHead(dir), typed));
    body.append(
      h(
        'div',
        { class: 'prompt end' },
        promptHead(dir),
        h('i', { class: 'cursor', 'aria-hidden': 'true' }),
      ),
    );
  }

  function focus(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.style.zIndex = ++topZ;
    wins.forEach((other, otherId) => other.el.classList.toggle('active', otherId === id));
  }

  function restore(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.classList.remove('min');
    win.el.hidden = false;
    fitAboveDock(win);
    focus(id);
    Bus.emit('win:change');
  }

  function minimise(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.classList.add('min');
    setTimeout(() => {
      if (win.el.classList.contains('min')) win.el.hidden = true;
    }, 220);
    Bus.emit('win:change');
  }

  function close(id) {
    const win = wins.get(id);
    if (!win) return;
    wins.delete(id);
    win.el.classList.add('closing');
    setTimeout(() => win.el.remove(), 160);
    if (win.onClose) win.onClose();

    const next = [...wins.keys()].pop();
    if (next) focus(next);
    if (win.opener && document.contains(win.opener)) win.opener.focus({ preventScroll: true });
    Bus.emit('win:change');
  }

  function keepTitleBarReachable(el) {
    if (el.classList.contains('max')) return;
    const host = layer().getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const left = parseFloat(el.style.left) || 0;
    const top = parseFloat(el.style.top) || 0;
    el.style.left = Math.min(Math.max(left, 90 - rect.width), host.width - 90) + 'px';
    el.style.top = Math.min(Math.max(top, 0), host.height - 44) + 'px';
  }

  function enableDrag(el, bar) {
    bar.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button') || el.classList.contains('max')) return;
      const rect = el.getBoundingClientRect();
      const host = layer().getBoundingClientRect();
      const grabX = event.clientX - rect.left;
      const grabY = event.clientY - rect.top;
      bar.setPointerCapture(event.pointerId);
      el.classList.add('dragging');

      const move = (e) => {
        el.style.left = e.clientX - grabX - host.left + 'px';
        el.style.top = e.clientY - grabY - host.top + 'px';
        keepTitleBarReachable(el);
      };
      const release = () => {
        el.classList.remove('dragging');
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', release);
        bar.removeEventListener('pointercancel', release);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', release);
      bar.addEventListener('pointercancel', release);
    });
  }

  function titleIcon({ ico, img }) {
    if (ico) return mIcon(ico, 'title-ico');
    if (img) return icon(img, 'title-ico');
    return null;
  }

  function createWindow(id, opts) {
    const { title } = opts;
    const body = h('div', { class: 'win-body' });
    const toggleSize = () => {
      el.classList.toggle('max');
      if (!el.classList.contains('max')) fitAboveDock(wins.get(id));
    };
    const lights = h(
      'div',
      { class: 'lights' },
      h('button', {
        class: 'light close',
        'aria-label': 'Close ' + title,
        onclick: () => close(id),
      }),
      h('button', {
        class: 'light min',
        'aria-label': 'Minimise ' + title,
        onclick: () => minimise(id),
      }),
      h('button', {
        class: 'light zoom',
        'aria-label': 'Switch between default and full size: ' + title,
        onclick: toggleSize,
      }),
    );
    const bar = h(
      'header',
      { class: 'win-bar' },
      lights,
      h('h2', { class: 'win-title' }, titleIcon(opts), title),
    );
    const el = h(
      'section',
      { class: 'win', role: 'dialog', 'aria-label': title, tabindex: '-1' },
      bar,
      body,
    );
    bar.addEventListener('dblclick', (event) => {
      if (!event.target.closest('button')) toggleSize();
    });
    return { el, bar, body };
  }

  function isMobileLayout() {
    return layer().getBoundingClientRect().width < MOBILE_BREAKPOINT;
  }

  function placeCascading(el, width) {
    const host = layer().getBoundingClientRect();
    const mobile = isMobileLayout();
    const fitted = Math.min(width, host.width - 16);
    const rank = spawned++ % 6;
    const step = rank * 30;
    const clearOfIcons = Math.min(150 + step, Math.max(EDGE_GAP, host.width - fitted - EDGE_GAP));
    el.style.width = fitted + 'px';
    el.style.left = (mobile ? EDGE_GAP : clearOfIcons) + 'px';
    el.style.top = (mobile ? 88 + step / 2 : 24 + step) + 'px';
    return rank;
  }

  function floorY() {
    const host = layer().getBoundingClientRect();
    const dock = document.getElementById('dock').getBoundingClientRect();
    const dockTop = dock.height > 0 ? dock.top : host.bottom;
    return Math.max(EDGE_GAP * 2, Math.min(host.bottom, dockTop) - host.top - DOCK_GAP);
  }

  function updateFloor() {
    layer().style.setProperty('--floor', floorY() + 'px');
  }

  function fitAboveDock(win) {
    const { el, body } = win;
    if (el.classList.contains('max') || el.hidden) return;
    updateFloor();
    el.style.removeProperty('--room');
    const floor = floorY();
    const height = el.offsetHeight;
    const chrome = height - body.offsetHeight;
    const top = parseFloat(el.style.top) || 0;
    const lifted = floor - height - win.rank * STAGGER;
    const next = Math.max(top + height > floor ? lifted : top, EDGE_GAP);
    el.style.top = next + 'px';
    el.style.setProperty('--room', Math.max(MIN_ROOM, floor - next - chrome) + 'px');
  }

  function centre(el) {
    if (isMobileLayout()) return;
    const host = layer().getBoundingClientRect();
    el.style.left = Math.max(EDGE_GAP, (host.width - el.offsetWidth) / 2) + 'px';
    el.style.top = Math.max(EDGE_GAP, (host.height - el.offsetHeight) / 2 - 24) + 'px';
  }

  function previouslyFocused() {
    const active = document.activeElement;
    return active && active !== document.body ? active : null;
  }

  function open(id, opts) {
    const existing = wins.get(id);
    if (existing) {
      if (existing.el.classList.contains('min')) restore(id);
      else focus(id);
      return existing;
    }

    const { width = 440, cmd, dir = '~', center, render, onClose } = opts;
    const opener = previouslyFocused();
    const { el, bar, body } = createWindow(id, opts);
    updateFloor();
    const rank = placeCascading(el, width);
    layer().append(el);
    el.addEventListener('pointerdown', () => focus(id));
    enableDrag(el, bar);

    const win = { el, body, onClose, opener, rank };
    wins.set(id, win);
    render(body, win);
    if (cmd) addPrompts(body, dir, cmd);
    if (center) centre(el);
    fitAboveDock(win);

    focus(id);
    if (!win.input) el.focus({ preventScroll: true });
    Bus.emit('win:change');
    return win;
  }

  addEventListener('resize', () =>
    wins.forEach((win) => {
      fitAboveDock(win);
      keepTitleBarReachable(win.el);
    }),
  );

  const ids = () => [...wins.keys()];

  window.Windows = {
    open,
    close,
    ids,
    isOpen: (id) => wins.has(id),
    active: () => ids().find((id) => wins.get(id).el.classList.contains('active')),
  };
})();
