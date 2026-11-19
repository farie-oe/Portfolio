(function () {
  const P = PORTFOLIO;
  const DEFAULT_COLOUR = 'butter';
  const MENU_MARGIN = 8;
  const SWATCH = {
    butter: '#F3D78A',
    pink: '#F6BCCB',
    blue: '#B4D5F3',
    lavender: '#CDB9EC',
    mint: '#B3E0C9',
    peach: '#F5C4A6',
    strawberry: '#EE97AE',
    sky: '#9CC7EC',
    cream: '#EFDDBF',
    'lilac-grey': '#CDC6DC',
  };
  const COLOURS = Object.keys(SWATCH);

  let nav = null;
  let ui = null;
  let menu = null;

  const folders = () => P.categories;
  const folderById = (id) => folders().find((folder) => folder.id === id);
  const filesIn = (folderId) => P.projects.filter((project) => project.category === folderId);
  const colourOf = (folder) =>
    (Store.state.colors && Store.state.colors[folder.id]) || folder.color || DEFAULT_COLOUR;
  const folderIcon = (colour) =>
    `icons/folder-${COLOURS.includes(colour) ? colour : DEFAULT_COLOUR}.png`;
  const colourName = (colour) => colour.replace('-', ' ');

  function setColour(folderId, colour) {
    if (!folderById(folderId) || !COLOURS.includes(colour)) return;
    Store.state.colors = { ...Store.state.colors, [folderId]: colour };
    Store.save();
    draw();
  }

  function go(folderId) {
    const target = folderById(folderId) ? folderId : folders()[0].id;
    if (target !== nav.current) {
      nav.back.push(nav.current);
      nav.forward = [];
    }
    nav.current = target;
    draw();
  }

  function goBack() {
    if (!nav.back.length) return;
    nav.forward.push(nav.current);
    nav.current = nav.back.pop();
    draw();
  }

  function goForward() {
    if (!nav.forward.length) return;
    nav.back.push(nav.current);
    nav.current = nav.forward.pop();
    draw();
  }

  function chevron(direction) {
    const path = direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
    const wrapper = document.createElement('span');
    wrapper.className = 'fx-svg';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
    return wrapper;
  }

  function navButton(label, onclick, content) {
    return h(
      'button',
      { class: 'fx-btn', type: 'button', 'aria-label': label, title: label, onclick },
      content,
    );
  }

  function draw() {
    if (!ui || !document.contains(ui.root)) return;
    closeMenu();
    const scrollTop = ui.main.scrollTop;
    drawSidebar();
    drawToolbar();
    drawFiles();
    drawStatus();
    ui.main.scrollTop = scrollTop;
  }

  function sidebarRow(folder) {
    const active = nav.current === folder.id;
    const row = h(
      'button',
      {
        class: 'fx-row' + (active ? ' active' : ''),
        type: 'button',
        'aria-current': active ? 'page' : null,
        onclick: () => go(folder.id),
      },
      h('img', {
        class: 'fx-row-ico',
        src: folderIcon(colourOf(folder)),
        alt: '',
        draggable: 'false',
      }),
      h('span', null, folder.label),
    );
    row.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showColourMenu(folder, event.clientX, event.clientY, row);
    });
    return row;
  }

  function drawSidebar() {
    ui.side.replaceChildren(
      h('h4', { class: 'fx-side-title' }, 'Folders'),
      ...folders().map(sidebarRow),
    );
  }

  function drawToolbar() {
    const folder = folderById(nav.current);
    const title = h(
      'nav',
      { class: 'fx-crumbs', 'aria-label': 'Current folder' },
      h('span', { class: 'fx-crumb here', 'aria-current': 'page' }, folder.label),
    );
    const backButton = navButton('Back', goBack, chevron('left'));
    backButton.disabled = nav.back.length === 0;
    const forwardButton = navButton('Forward', goForward, chevron('right'));
    forwardButton.disabled = nav.forward.length === 0;
    const colourButton = h(
      'button',
      {
        class: 'fx-btn fx-colour',
        type: 'button',
        'aria-label': `Change colour of ${folder.label}`,
        'aria-haspopup': 'menu',
        title: 'Change folder colour',
        onclick: (event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          showColourMenu(folder, rect.right - 190, rect.bottom + 4, event.currentTarget);
        },
      },
      h('i', { class: 'fx-colour-dot', style: `background:${SWATCH[colourOf(folder)]}` }),
    );
    ui.bar.replaceChildren(backButton, forwardButton, title, colourButton);
  }

  function fileIcon(project) {
    if (project.kind === 'report') return mIcon('file-pdf', 'fx-ico');
    if (project.ico) return mIcon(project.ico, 'fx-ico');
    return h('img', { class: 'fx-ico', src: project.img, alt: '', draggable: 'false' });
  }

  function fileCell(project) {
    return h(
      'div',
      { class: 'fx-cell' },
      h(
        'button',
        {
          class: 'fx-item',
          type: 'button',
          'aria-label': `${project.title}, ${project.status}`,
          onclick: () => Apps.project(project.id),
        },
        fileIcon(project),
        h('span', { class: 'fx-name' }, project.title),
      ),
    );
  }

  function drawFiles() {
    const files = filesIn(nav.current);
    ui.main.replaceChildren(...files.map(fileCell));
    if (files.length === 0) {
      ui.main.append(
        h(
          'div',
          { class: 'fx-empty' },
          mIcon('about', 'fx-empty-ico'),
          h('p', null, 'Nothing in here yet.'),
        ),
      );
    }
  }

  function drawStatus() {
    const count = filesIn(nav.current).length;
    ui.status.replaceChildren(h('span', null, `${count} item${count === 1 ? '' : 's'}`));
  }

  function closeMenu() {
    if (!menu) return;
    const { el, anchor, removeListeners } = menu;
    menu = null;
    removeListeners();
    el.remove();
    if (anchor && document.contains(anchor)) anchor.focus({ preventScroll: true });
  }

  function colourMenuElement(folder) {
    const current = colourOf(folder);
    const swatches = COLOURS.map((colour) =>
      h('button', {
        class: 'fx-swatch' + (current === colour ? ' on' : ''),
        type: 'button',
        role: 'menuitemradio',
        'aria-checked': String(current === colour),
        style: `background:${SWATCH[colour]}`,
        'aria-label': colourName(colour),
        title: colourName(colour),
        onclick: () => {
          closeMenu();
          setColour(folder.id, colour);
        },
      }),
    );
    return h(
      'div',
      { class: 'fx-menu', role: 'menu', 'aria-label': `Colour for ${folder.label}` },
      h('div', { class: 'fx-menu-title' }, 'Folder colour'),
      h('div', { class: 'fx-swatches' }, swatches),
    );
  }

  function placeWithinViewport(el, x, y) {
    const rect = el.getBoundingClientRect();
    el.style.left =
      Math.max(MENU_MARGIN, Math.min(x, innerWidth - rect.width - MENU_MARGIN)) + 'px';
    el.style.top =
      Math.max(MENU_MARGIN, Math.min(y, innerHeight - rect.height - MENU_MARGIN)) + 'px';
  }

  function listenWhileMenuOpen(el) {
    const unbind = bindPopupMenu(el, {
      itemSelector: '.fx-swatch',
      steps: { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 },
      dismiss: closeMenu,
    });
    addEventListener('resize', closeMenu);
    return () => {
      unbind();
      removeEventListener('resize', closeMenu);
    };
  }

  function showColourMenu(folder, x, y, anchor) {
    closeMenu();
    const el = colourMenuElement(folder);
    document.getElementById('modal-root').append(el);
    placeWithinViewport(el, x, y);
    menu = { el, anchor, removeListeners: listenWhileMenuOpen(el) };
    (el.querySelector('.fx-swatch.on') || el.querySelector('.fx-swatch')).focus();
  }

  function open() {
    if (Windows.isOpen('work')) {
      Windows.open('work', {});
      return;
    }
    nav = { current: folders()[0].id, back: [], forward: [] };
    Windows.open('work', {
      title: 'Work',
      ico: 'work',
      width: 800,
      onClose() {
        closeMenu();
        ui = null;
      },
      render(body) {
        body.classList.add('fx-body');
        ui = {
          root: h('div', { class: 'fx' }),
          side: h('nav', { class: 'fx-side', 'aria-label': 'Folders' }),
          bar: h('div', { class: 'fx-bar' }),
          main: h('div', { class: 'fx-main' }),
          status: h('div', { class: 'fx-status' }),
        };
        ui.root.append(ui.side, ui.bar, ui.main, ui.status);
        body.append(ui.root);
        draw();
      },
    });
  }

  window.Explorer = { open };
})();
