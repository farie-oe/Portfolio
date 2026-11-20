(function () {
  const P = PORTFOLIO;
  const DEFAULT_COLOUR = 'butter';
  const MENU_MARGIN = 8;
  const DETAIL_DEPTH = 3;
  const HOME_LABEL = 'Projects';
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
  const projectById = (id) => P.projects.find((project) => project.id === id);
  const filesIn = (folderId) => P.projects.filter((project) => project.category === folderId);
  const colourOf = (folder) =>
    (Store.state.colors && Store.state.colors[folder.id]) || folder.color || DEFAULT_COLOUR;
  const folderIcon = (colour) =>
    `icons/folder-${COLOURS.includes(colour) ? colour : DEFAULT_COLOUR}.png`;
  const colourName = (colour) => colour.replace('-', ' ');
  const samePath = (a, b) => a.join('/') === b.join('/');
  const isDetail = (path) => path.length === DETAIL_DEPTH;

  function validPath(path) {
    const [rootId, projectId, key] = path;
    if (rootId === undefined) return [];
    if (!folderById(rootId)) return [folders()[0].id];
    const project = projectId && projectById(projectId);
    if (!project || !project.networking || project.category !== rootId) return [rootId];
    if (key && !Networking.entries(project.networking).some((entry) => entry.key === key)) {
      return [rootId, projectId];
    }
    return path.slice(0, key ? DETAIL_DEPTH : 2);
  }

  function setColour(folderId, colour) {
    if (!folderById(folderId) || !COLOURS.includes(colour)) return;
    Store.state.colors = { ...Store.state.colors, [folderId]: colour };
    Store.save();
    draw();
  }

  function go(path) {
    const target = validPath(path);
    if (!samePath(target, nav.path)) {
      nav.back.push(nav.path);
      nav.forward = [];
    }
    nav.path = target;
    draw();
    ui.main.scrollTop = 0;
  }

  function goBack() {
    if (!nav.back.length) return;
    nav.forward.push(nav.path);
    nav.path = nav.back.pop();
    draw();
    ui.main.scrollTop = 0;
  }

  function goForward() {
    if (!nav.forward.length) return;
    nav.back.push(nav.path);
    nav.path = nav.forward.pop();
    draw();
    ui.main.scrollTop = 0;
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

  function entriesFor(path) {
    if (path.length === 0) {
      return folders().map((folder) => ({
        kind: 'folder',
        label: folder.label,
        colour: colourOf(folder),
        path: [folder.id],
      }));
    }
    const root = folderById(path[0]);
    if (path.length === 1) {
      return filesIn(root.id).map((project) =>
        project.networking
          ? {
              kind: 'folder',
              label: project.title,
              colour: colourOf(root),
              path: [root.id, project.id],
            }
          : { kind: 'project', label: project.title, project },
      );
    }
    const project = projectById(path[1]);
    return Networking.entries(project.networking).map((entry) => ({
      kind: 'document',
      label: entry.label,
      icon: entry.icon,
      path: [root.id, project.id, entry.key],
    }));
  }

  function crumbsFor(path) {
    const trail = [{ label: HOME_LABEL, path: [] }];
    if (path.length >= 1) trail.push({ label: folderById(path[0]).label, path: path.slice(0, 1) });
    if (path.length >= 2) {
      trail.push({ label: projectById(path[1]).title, path: path.slice(0, 2) });
    }
    if (path.length >= DETAIL_DEPTH) {
      const entry = Networking.entries(projectById(path[1]).networking).find(
        (candidate) => candidate.key === path[2],
      );
      trail.push({ label: entry.label, path });
    }
    return trail;
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
    const active = nav.path[0] === folder.id;
    const row = h(
      'button',
      {
        class: 'fx-row' + (active ? ' active' : ''),
        type: 'button',
        'aria-current': active ? 'page' : null,
        onclick: () => go([folder.id]),
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

  function crumbButtons(path) {
    const trail = crumbsFor(path);
    return trail.flatMap((crumb, index) => {
      const here = index === trail.length - 1;
      const item = here
        ? h('span', { class: 'fx-crumb here', 'aria-current': 'page' }, crumb.label)
        : h(
            'button',
            { class: 'fx-crumb', type: 'button', onclick: () => go(crumb.path) },
            crumb.label,
          );
      return index ? [h('span', { class: 'fx-sep', 'aria-hidden': 'true' }, '›'), item] : [item];
    });
  }

  function colourButton(folder) {
    return h(
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
  }

  function drawToolbar() {
    const title = h(
      'nav',
      { class: 'fx-crumbs', 'aria-label': 'Current location' },
      crumbButtons(nav.path),
    );
    const backButton = navButton('Back', goBack, chevron('left'));
    backButton.disabled = nav.back.length === 0;
    const forwardButton = navButton('Forward', goForward, chevron('right'));
    forwardButton.disabled = nav.forward.length === 0;
    ui.bar.replaceChildren(
      backButton,
      forwardButton,
      title,
      nav.path.length ? colourButton(folderById(nav.path[0])) : null,
    );
  }

  function projectIcon(project) {
    if (project.kind === 'report') return mIcon('file-pdf', 'fx-ico');
    if (project.ico) return mIcon(project.ico, 'fx-ico');
    return h('img', { class: 'fx-ico', src: project.img, alt: '', draggable: 'false' });
  }

  function entryIcon(entry) {
    if (entry.kind === 'folder') {
      return h('img', {
        class: 'fx-ico',
        src: folderIcon(entry.colour),
        alt: '',
        draggable: 'false',
      });
    }
    return entry.kind === 'project' ? projectIcon(entry.project) : mIcon(entry.icon, 'fx-ico');
  }

  function entryAction(entry) {
    return entry.kind === 'project' ? () => Apps.project(entry.project.id) : () => go(entry.path);
  }

  function entryLabel(entry) {
    if (entry.kind === 'project') return `${entry.label}, ${entry.project.status}`;
    return entry.kind === 'folder' ? `${entry.label}, folder` : entry.label;
  }

  function entryCell(entry) {
    return h(
      'div',
      { class: 'fx-cell' },
      h(
        'button',
        {
          class: 'fx-item',
          type: 'button',
          'aria-label': entryLabel(entry),
          onclick: entryAction(entry),
        },
        entryIcon(entry),
        h('span', { class: 'fx-name' }, entry.label),
      ),
    );
  }

  function drawFiles() {
    const detail = isDetail(nav.path);
    ui.main.classList.toggle('fx-detail', detail);
    if (detail) {
      const project = projectById(nav.path[1]);
      ui.main.replaceChildren(Networking.view(project.networking, nav.path[2]));
      return;
    }
    const entries = entriesFor(nav.path);
    ui.main.replaceChildren(...entries.map(entryCell));
    if (entries.length === 0) {
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
    if (isDetail(nav.path)) {
      ui.status.replaceChildren(h('span', null, crumbsFor(nav.path).pop().label));
      return;
    }
    const count = entriesFor(nav.path).length;
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

  function open(path) {
    if (Windows.isOpen('work')) {
      Windows.open('work', {});
      if (path) go(path);
      return;
    }
    nav = { path: validPath(path || [folders()[0].id]), back: [], forward: [] };
    Windows.open('work', {
      title: 'Projects',
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
