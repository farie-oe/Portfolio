(function () {
  const P = PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  const WELCOME_MIN_WIDTH = 900;
  const OWNED_WINDOW_PREFIXES = { work: ['project-', 'report-'], certs: ['cert-'] };
  const DESKTOP_APPS = P.apps.filter((app) => app.desk);
  const DOCK_APPS = P.apps.filter((app) => !app.desk);

  function isAppOpen(appId) {
    const owned = OWNED_WINDOW_PREFIXES[appId] || [];
    return Windows.ids().some(
      (windowId) =>
        windowId === appId ||
        windowId.startsWith(appId + '-') ||
        owned.some((prefix) => windowId.startsWith(prefix)),
    );
  }

  function buildMenu() {
    $('menu-name').textContent = P.owner.labName;
    $('menu-logo').addEventListener('click', () => Apps.open('about'));
    $('menu-flags').addEventListener('click', () => Apps.open('flags'));
  }

  function buildDesktopIcons() {
    DESKTOP_APPS.forEach((app) => {
      $('desk-icons').append(
        h(
          'button',
          {
            class: 'desk-icon',
            'data-app': app.id,
            title: app.label,
            onclick: () => Apps.open(app.id),
          },
          h('span', { class: 'desk-tile' }, mIcon(app.ico)),
          h('span', { class: 'desk-label' }, app.label),
          h('i', { class: 'run-dot' }),
        ),
      );
    });
  }

  function bounce(el) {
    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
  }

  function createDockItem(app, extraClass) {
    const item = h(
      'button',
      {
        class: 'dock-item' + (extraClass ? ' ' + extraClass : ''),
        'data-app': app.id,
        'aria-label': app.label,
        onclick: (event) => {
          bounce(event.currentTarget);
          Apps.open(app.id);
        },
      },
      mIcon(app.ico, 'dock-ico'),
      h('span', { class: 'dock-label' }, app.label),
      h('i', { class: 'run-dot' }),
    );
    if (app.id === 'flags') {
      item.append(h('b', { class: 'badge', id: 'flag-badge', 'aria-hidden': 'true' }));
    }
    return item;
  }

  function syncOpenApps(dock) {
    DESKTOP_APPS.forEach((app) => {
      const slot = dock.querySelector(`.dock-item.temp[data-app="${app.id}"]`);
      const open = isAppOpen(app.id);
      if (open && !slot) dock.append(createDockItem(app, 'temp'));
      else if (!open && slot) slot.remove();
    });
    document
      .querySelectorAll('.dock-item, .desk-icon')
      .forEach((el) => el.classList.toggle('running', isAppOpen(el.dataset.app)));
  }

  function syncFlagCounters() {
    const remaining = Flags.remaining();
    const found = `${Flags.count()} of ${Flags.total()}`;
    $('flag-badge').textContent = remaining;
    $('flag-badge').hidden = remaining === 0;
    $('menu-flags').setAttribute('aria-label', `Flag hunt: ${found} found`);
    $('flag-count').textContent = `${Flags.count()}/${Flags.total()}`;
  }

  function buildDock() {
    const dock = $('dock');
    DOCK_APPS.forEach((app) => dock.append(createDockItem(app)));
    const sync = () => {
      syncOpenApps(dock);
      syncFlagCounters();
    };
    Bus.on('win:change', sync);
    Bus.on('flags:change', sync);
    sync();
  }

  function startClock() {
    const el = $('clock');
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 15000);
  }

  function logConsoleFlag() {
    const { flag } = Flags.byId('devtools');
    const style =
      'font:700 16px monospace;color:#91C9E2;background:#030B19;padding:4px 8px;border-radius:6px';
    console.log('%cpsst, curious one', style);
    console.log(
      `You found the console! Here is a flag: ${flag}\nOpen the terminal and type: submit ${flag}`,
    );
  }

  function onLogin() {
    let announced = false;
    return (isFreshLogin) => {
      if (!announced) {
        announced = true;
        Bus.emit('boot');
      }
      if (isFreshLogin && innerWidth >= WELCOME_MIN_WIDTH) setTimeout(() => Welcome.open(), 450);
    };
  }

  function closeActiveOnEscape(event) {
    if (event.key !== 'Escape' || Power.isLocked()) return;
    if (Flags.isOpen()) return Flags.hidePanel();
    if (event.target.closest?.('input')) return;
    const active = Windows.active();
    if (active) Windows.close(active);
  }

  function boot() {
    Store.load();
    buildMenu();
    startClock();
    buildDesktopIcons();
    buildDock();
    logConsoleFlag();
    Power.start(onLogin());
    document.addEventListener('keydown', closeActiveOnEscape);
  }

  boot();
})();
