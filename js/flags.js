(function () {
  const FLAGS = PORTFOLIO.flags;
  let panelEl = null;
  let opener = null;
  let freshFlagId = null;

  const byId = (id) => FLAGS.find((flag) => flag.id === id);
  const isFound = (flag) => Boolean(Store.state.found[flag.id]);
  const total = () => FLAGS.length;
  const count = () => FLAGS.filter(isFound).length;
  const remaining = () => total() - count();
  const hintLevel = (flag) => Store.state.hints[flag.id] || 0;

  function toast(...kids) {
    const el = h('div', { class: 'toast' }, ...kids);
    document.getElementById('toasts').append(el);
    setTimeout(() => el.classList.add('out'), 3800);
    setTimeout(() => el.remove(), 4200);
  }

  function markFound(flag) {
    Store.state.found[flag.id] = true;
    Store.save();
    freshFlagId = flag.id;
    toast(
      mIcon('flag', 'toast-ico'),
      h('span', null, `Flag found! ${count()} of ${total()}`, h('code', null, flag.flag)),
    );
    Bus.emit('flags:found', flag);
    Bus.emit('flags:change');
    if (remaining() === 0) setTimeout(() => Bus.emit('flags:complete'), 700);
    refresh();
  }

  function reveal(id) {
    const flag = byId(id);
    if (flag && !isFound(flag)) markFound(flag);
    return flag;
  }

  function submit(text) {
    const flag = FLAGS.find((candidate) => candidate.flag === text.trim().toLowerCase());
    if (!flag) return 'bad';
    if (isFound(flag)) return 'dup';
    markFound(flag);
    return 'ok';
  }

  function giveHint(flag) {
    if (isFound(flag) || hintLevel(flag) >= flag.hints.length) return;
    Store.state.hints[flag.id] = hintLevel(flag) + 1;
    Store.save();
    refresh();
  }

  function hintsFor(flag, index, level) {
    const shown =
      level > 0
        ? h(
            'ul',
            { class: 'quest-hints' },
            flag.hints.slice(0, level).map((hint) => h('li', null, hint)),
          )
        : null;
    const more =
      level < flag.hints.length
        ? h(
            'button',
            {
              class: 'hint-btn',
              type: 'button',
              onclick: () => giveHint(flag),
              'aria-label': `Get ${level ? 'another' : 'a'} hint for flag ${index + 1}`,
            },
            level ? 'Another hint' : 'Need a hint?',
          )
        : null;
    return [shown, more];
  }

  function flagRow(flag, index) {
    const found = isFound(flag);
    const classes = ['quest', found && 'done', freshFlagId === flag.id && 'fresh'];
    return h(
      'li',
      { class: classes.filter(Boolean).join(' ') },
      h('span', { class: 'check', 'aria-hidden': 'true' }, found ? '✓' : String(index + 1)),
      h(
        'div',
        { class: 'quest-text' },
        h('strong', null, found ? flag.flag : `Flag ${index + 1}`),
        h('small', null, flag.clue),
        found ? null : hintsFor(flag, index, hintLevel(flag)),
      ),
    );
  }

  function inlineLink(label, appId) {
    const open = () => {
      hidePanel();
      Apps.open(appId);
    };
    return h('button', { class: 'inline-link', type: 'button', onclick: open }, label);
  }

  function summary() {
    if (remaining() > 0) {
      return {
        title: `Flag hunt: ${count()} of ${total()}`,
        text: 'Six little flags, written like flag{something}, are hidden in the sky, the terminal and the page itself. It is entirely optional, and none of the portfolio is locked behind it.',
      };
    }
    return {
      title: 'All flags found!',
      text: [
        'You found everything! Thanks for playing along. Continue to explore ',
        inlineLink('more', 'projects'),
        ", or reach out to me and let's ",
        inlineLink('connect', 'contact'),
        '!',
      ],
    };
  }

  function panelContent() {
    const { title, text } = summary();
    const content = [
      h(
        'div',
        { class: 'quest-hero' },
        h('div', { class: 'flag-big', 'aria-hidden': 'true' }, mIcon('flag', 'flag-big-ico')),
        h('div', null, h('h3', null, title), h('p', null, text)),
      ),
      h('ul', { class: 'quests' }, FLAGS.map(flagRow)),
      h(
        'div',
        { class: 'modal-actions' },
        h(
          'button',
          {
            class: 'btn',
            onclick: () => {
              hidePanel();
              Terminal.open();
            },
          },
          'Open terminal to submit',
        ),
        h('button', { class: 'btn', onclick: hidePanel }, 'Close'),
      ),
    ];
    freshFlagId = null;
    return content;
  }

  function refresh() {
    if (!panelEl) return;
    panelEl.querySelector('.win-body').replaceChildren(...panelContent());
  }

  function createPanel() {
    const closeButton = h('button', {
      class: 'light close',
      'aria-label': 'Close flag hunt',
      onclick: hidePanel,
    });
    const bar = h(
      'header',
      { class: 'win-bar' },
      h('div', { class: 'lights' }, closeButton),
      h('h2', { class: 'win-title' }, mIcon('flag', 'title-ico'), 'Flag hunt'),
    );
    const dialog = h(
      'section',
      { class: 'win modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Flag hunt' },
      bar,
      h('div', { class: 'win-body' }),
    );
    return h(
      'div',
      {
        class: 'modal-backdrop',
        onclick: (event) => {
          if (event.target === panelEl) hidePanel();
        },
      },
      dialog,
    );
  }

  function showPanel() {
    if (panelEl) return;
    opener = document.activeElement;
    panelEl = createPanel();
    document.getElementById('modal-root').append(panelEl);
    refresh();
    panelEl.querySelector('.btn').focus({ preventScroll: true });
  }

  function hidePanel() {
    if (!panelEl) return;
    const el = panelEl;
    panelEl = null;
    el.classList.add('closing');
    setTimeout(() => el.remove(), 160);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }

  window.Flags = {
    reveal,
    submit,
    remaining,
    count,
    total,
    showPanel,
    hidePanel,
    isOpen: () => Boolean(panelEl),
    all: () => FLAGS,
    isFound,
    byId,
  };
})();
