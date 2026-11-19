(function () {
  const wins = new Map();
  const MOBILE_BREAKPOINT = 640;
  const EDGE_GAP = 8;
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
    const toggleSize = () => el.classList.toggle('max');
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
    const step = (spawned++ % 6) * 30;
    const clearOfIcons = Math.min(150 + step, Math.max(EDGE_GAP, host.width - fitted - EDGE_GAP));
    el.style.width = fitted + 'px';
    el.style.left = (mobile ? EDGE_GAP : clearOfIcons) + 'px';
    el.style.top = (mobile ? 88 + step / 2 : 24 + step) + 'px';
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
    placeCascading(el, width);
    layer().append(el);
    el.addEventListener('pointerdown', () => focus(id));
    enableDrag(el, bar);

    const win = { el, body, onClose, opener };
    wins.set(id, win);
    render(body, win);
    if (cmd) addPrompts(body, dir, cmd);
    if (center) centre(el);

    focus(id);
    if (!win.input) el.focus({ preventScroll: true });
    Bus.emit('win:change');
    return win;
  }

  addEventListener('resize', () => wins.forEach((win) => keepTitleBarReachable(win.el)));

  const ids = () => [...wins.keys()];

  window.Windows = {
    open,
    close,
    ids,
    isOpen: (id) => wins.has(id),
    active: () => ids().find((id) => wins.get(id).el.classList.contains('active')),
  };
})();
