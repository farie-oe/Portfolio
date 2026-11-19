(function () {
  const SESSION_KEY = 'lab-session';
  const INERT_REGIONS = ['menubar', 'desktop', 'dock', 'cat', 'modal-root'];
  const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BOOT_MS = REDUCED_MOTION ? 700 : 3000;
  const LOGIN_DELAY_MS = REDUCED_MOTION ? 200 : 1300;
  const SPARKS = [
    [8, 18],
    [16, 64],
    [24, 30],
    [34, 80],
    [46, 12],
    [58, 72],
    [68, 24],
    [78, 58],
    [86, 14],
    [92, 70],
    [12, 86],
    [72, 88],
  ];
  const MENU_ITEMS = [
    { action: 'sleep', label: 'Sleep', tone: 'sky' },
    { action: 'logoff', label: 'Log off', tone: 'butter' },
    { action: 'restart', label: 'Restart', tone: 'pink' },
  ];

  let currentScreen = null;
  let loginHandler = () => {};
  let menu = null;

  const clockText = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateText = () =>
    new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  const isActivationKey = (event) => event.key === 'Enter' || event.key === ' ';

  function setDesktopInert(inert) {
    INERT_REGIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.inert = inert;
    });
  }

  function mountScreen(cls, label, kids) {
    const previous = currentScreen;
    const el = h(
      'div',
      {
        class: 'power ' + cls,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': label,
        tabindex: '-1',
      },
      ...kids,
    );
    currentScreen = el;
    document.body.append(el);
    setDesktopInert(true);
    closeMenu();
    if (previous) setTimeout(() => previous.remove(), 500);
    return el;
  }

  function unmountScreen(el) {
    if (currentScreen !== el) return;
    currentScreen = null;
    setDesktopInert(false);
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 900);
  }

  function skyBackdrop() {
    const clouds = [0, 1, 2].map((i) =>
      h('i', { class: 'power-cloud c' + i, 'aria-hidden': 'true' }),
    );
    const sparks = SPARKS.map(([x, y], i) =>
      h('i', {
        class: 'power-spark',
        'aria-hidden': 'true',
        style: `left:${x}%;top:${y}%;--d:${(i % 4) * 0.6}s`,
      }),
    );
    return [...clouds, ...sparks];
  }

  function showBoot(onDone) {
    const screen = mountScreen('sky boot', 'Loading', [
      ...skyBackdrop(),
      h(
        'div',
        { class: 'power-center' },
        h(
          'div',
          { class: 'boot-kitten' },
          mIcon('about', 'boot-kitten-ico'),
          h('i', { class: 'boot-shadow', 'aria-hidden': 'true' }),
        ),
        h('h1', { class: 'boot-title' }, PORTFOLIO.owner.labName),
        h(
          'div',
          { class: 'boot-bar', style: `--ms:${BOOT_MS}ms`, 'aria-hidden': 'true' },
          h('i', { class: 'boot-fill' }),
        ),
        h('div', { class: 'boot-dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
      ),
      h('button', { class: 'power-skip', type: 'button' }, 'Skip'),
    ]);
    screen.focus({ preventScroll: true });

    let finished = false;
    const autoFinish = setTimeout(finish, BOOT_MS + 250);
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(autoFinish);
      onDone();
    }
    screen.addEventListener('click', finish);
    screen.addEventListener('keydown', finish);
  }

  function showLogin(isFreshLogin) {
    const time = h('div', { class: 'login-time' }, clockText());
    const date = h('div', { class: 'login-date' }, dateText());
    const greeting = h('p', { class: 'login-hello' });
    const loginButton = h(
      'button',
      { class: 'login-btn', type: 'button' },
      'Log in',
      h('i', { class: 'login-arrow', 'aria-hidden': 'true' }),
    );
    const screen = mountScreen('sky login', 'Log in', [
      ...skyBackdrop(),
      h('div', { class: 'login-top' }, time, date),
      h(
        'div',
        { class: 'power-center' },
        h('div', { class: 'login-avatar' }, mIcon('about', 'login-avatar-ico')),
        greeting,
        loginButton,
      ),
    ]);

    const refreshClock = setInterval(() => {
      if (!document.contains(screen)) return clearInterval(refreshClock);
      time.textContent = clockText();
      date.textContent = dateText();
    }, 1000);

    let enteredDesktop = false;
    function enterDesktop() {
      if (enteredDesktop) return;
      enteredDesktop = true;
      screen.classList.add('entering');
      greeting.textContent = 'Welcome';
      loginButton.disabled = true;
      safeStorage.set(sessionStorage, SESSION_KEY, '1');
      setTimeout(() => {
        unmountScreen(screen);
        loginHandler(isFreshLogin);
      }, LOGIN_DELAY_MS);
    }
    loginButton.addEventListener('click', enterDesktop);
    screen.addEventListener('keydown', (event) => {
      if (!isActivationKey(event)) return;
      event.preventDefault();
      enterDesktop();
    });
    loginButton.focus({ preventScroll: true });
  }

  function showSleep() {
    const stars = SPARKS.map(([x, y], i) =>
      h('i', {
        class: 'sleep-star',
        'aria-hidden': 'true',
        style: `left:${x}%;top:${Math.min(y, 60)}%;--d:${(i % 5) * 0.5}s`,
      }),
    );
    const screen = mountScreen('sleep', 'Sleeping. Click to wake up.', [
      ...stars,
      h('i', { class: 'sleep-moon', 'aria-hidden': 'true' }),
      h(
        'div',
        { class: 'power-center' },
        h(
          'div',
          { class: 'sleep-kitten' },
          mIcon('about', 'sleep-kitten-ico'),
          h('b', { class: 'zzz z1', 'aria-hidden': 'true' }, 'z'),
          h('b', { class: 'zzz z2', 'aria-hidden': 'true' }, 'z'),
          h('b', { class: 'zzz z3', 'aria-hidden': 'true' }, 'Z'),
        ),
        h('p', { class: 'sleep-hint' }, 'Click to wake up'),
      ),
    ]);
    screen.focus({ preventScroll: true });

    let awake = false;
    const wakeUp = () => {
      if (awake) return;
      awake = true;
      showLogin(false);
    };
    setTimeout(() => {
      screen.addEventListener('click', wakeUp);
      screen.addEventListener('keydown', wakeUp);
    }, 400);
  }

  function closeEverything() {
    if (Flags.isOpen()) Flags.hidePanel();
    Windows.ids().forEach((id) => Windows.close(id));
  }

  const powerActions = {
    sleep: showSleep,
    logoff() {
      closeEverything();
      showLogin(true);
    },
    restart() {
      closeEverything();
      showBoot(() => showLogin(true));
    },
  };

  function closeMenu() {
    if (!menu) return;
    menu.el.remove();
    menu.unbind();
    menu.button.setAttribute('aria-expanded', 'false');
    menu = null;
  }

  function menuItem({ action, label, tone }) {
    const choose = () => {
      closeMenu();
      powerActions[action]();
    };
    return h(
      'button',
      { class: 'power-item', type: 'button', role: 'menuitem', onclick: choose },
      h('i', { class: 'power-dot tone-' + tone, 'aria-hidden': 'true' }),
      label,
    );
  }

  function openMenu(button) {
    if (menu) return closeMenu();
    const el = h(
      'div',
      { class: 'power-menu', role: 'menu', 'aria-label': 'Power' },
      MENU_ITEMS.map(menuItem),
    );
    document.body.append(el);
    button.setAttribute('aria-expanded', 'true');
    const unbind = bindPopupMenu(el, {
      itemSelector: '.power-item',
      steps: { ArrowDown: 1, ArrowUp: -1 },
      ignoreClicksOn: button,
      dismiss(reason) {
        closeMenu();
        if (reason === 'escape') button.focus();
      },
    });
    menu = { el, button, unbind };
    el.querySelector('.power-item').focus();
  }

  function addPowerButton() {
    const button = h('button', {
      class: 'menu-power',
      type: 'button',
      'aria-label': 'Power',
      'aria-haspopup': 'menu',
      'aria-expanded': 'false',
      title: 'Power',
    });
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 3v8"/><path d="M6.4 6.8a8 8 0 1 0 11.2 0"/></svg>';
    button.addEventListener('click', () => openMenu(button));
    document.getElementById('clock').before(button);
  }

  function start(onLogin) {
    loginHandler = onLogin;
    addPowerButton();
    if (safeStorage.get(sessionStorage, SESSION_KEY) === '1') return onLogin(true);
    setDesktopInert(true);
    showBoot(() => showLogin(true));
  }

  window.Power = { start, isLocked: () => Boolean(currentScreen) };
})();
