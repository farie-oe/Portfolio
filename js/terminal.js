(function () {
  const Shell = TerminalShell;
  const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_AUTOFOCUS_WIDTH = 640;

  const history = [];
  let historyIndex = 0;

  function commonPrefix(words) {
    return words.reduce((prefix, word) => {
      let length = 0;
      while (length < prefix.length && prefix[length] === word[length]) length++;
      return prefix.slice(0, length);
    });
  }

  function createView(body) {
    const output = h('div', { class: 'term-out', 'aria-live': 'polite' });
    const input = h('input', {
      class: 'term-input',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      'aria-label': 'Terminal command',
    });
    const directory = h('span', { class: 'p-dir' }, ':' + Shell.currentDirectory());
    const promptLine = h(
      'label',
      { class: 'prompt term-line' },
      h('span', { class: 'p-user' }, Shell.user),
      directory,
      h('span', { class: 'p-sign' }, '$ '),
      input,
    );
    body.append(output, promptLine);
    return { output, input, directory };
  }

  function promptPrefix() {
    return [
      h('span', { class: 'p-user' }, Shell.user),
      h('span', { class: 'p-dir' }, ':' + Shell.currentDirectory()),
      h('span', { class: 'p-sign' }, '$ '),
    ];
  }

  function createSession(body, { output, input, directory }) {
    const scrollToEnd = () =>
      requestAnimationFrame(() =>
        body.scrollTo({ top: body.scrollHeight, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }),
      );
    const printNode = (node) => output.append(node);
    const print = (text, cls) => printNode(h('div', { class: 'out ' + (cls || '') }, text));
    const clear = () => output.replaceChildren();
    const echoPrompt = (text = '') =>
      output.append(h('div', { class: 'prompt' }, promptPrefix(), text));

    const link = (label, action) =>
      h(
        'button',
        {
          class: 'term-link',
          type: 'button',
          onclick: (event) => {
            event.stopPropagation();
            action();
            input.focus();
          },
        },
        label,
      );

    const ctx = { print, printNode, clear, link };

    function exec(command) {
      echoPrompt(command);
      history.push(command);
      historyIndex = history.length;
      Shell.run(command, ctx);
      directory.textContent = ':' + Shell.currentDirectory();
      scrollToEnd();
    }

    ctx.row = (prefix, word, command, description, padding) =>
      printNode(
        h(
          'div',
          { class: 'out' },
          prefix,
          link(word, () => exec(command)),
          ' '.repeat(Math.max(1, padding || 1)),
          h('span', { class: 'dim' }, description || ''),
        ),
      );

    return { print, printNode, clear, link, exec, echoPrompt, scrollToEnd };
  }

  function printWelcome(session) {
    session.print("Welcome to Mafaro's terminal.", 'strong');
    session.printNode(
      h(
        'div',
        { class: 'out dim' },
        'Type ',
        session.link('help', () => session.exec('help')),
        ' to see what it can do, or try ',
        session.link('neofetch', () => session.exec('neofetch')),
        '.',
      ),
    );
    session.print('');
  }

  function completeTyped(input, session) {
    const parts = input.value.split(/\s+/);
    const typed = parts[parts.length - 1].toLowerCase();
    const pool =
      parts.length <= 1 ? Shell.listedCommands : Shell.argumentChoices(parts[0].toLowerCase());
    const matches = pool.filter((word) => word.toLowerCase().startsWith(typed));
    if (matches.length === 0) return;

    const replaceLastWord = (word, addSpace) => {
      parts[parts.length - 1] = word;
      input.value = parts.join(' ') + (addSpace ? ' ' : '');
    };
    if (matches.length === 1) return replaceLastWord(matches[0], !matches[0].endsWith('/'));

    const shared = commonPrefix(matches);
    if (shared.length > typed.length) return replaceLastWord(shared, false);

    session.echoPrompt(input.value);
    session.print(matches.join('   '), 'dim');
    session.scrollToEnd();
  }

  function bindKeys(input, session) {
    let unsentDraft = '';

    function submit() {
      const command = input.value.trim();
      input.value = '';
      unsentDraft = '';
      if (command) {
        session.exec(command);
      } else {
        session.echoPrompt();
        session.scrollToEnd();
      }
    }

    function recall(step) {
      if (step < 0 && historyIndex === history.length) unsentDraft = input.value;
      historyIndex = Math.min(history.length, Math.max(0, historyIndex + step));
      input.value = historyIndex === history.length ? unsentDraft : history[historyIndex];
    }

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        submit();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        completeTyped(input, session);
      } else if (event.key === 'l' && event.ctrlKey) {
        event.preventDefault();
        session.clear();
      } else if (event.key === 'ArrowUp' && history.length) {
        event.preventDefault();
        recall(-1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        recall(1);
      }
    });
  }

  function open() {
    const alreadyOpen = Windows.isOpen('terminal');
    const win = Windows.open('terminal', {
      title: 'terminal',
      ico: 'terminal',
      width: 600,
      center: true,
      render(body, self) {
        const view = createView(body);
        const session = createSession(body, view);
        printWelcome(session);
        bindKeys(view.input, session);
        body.addEventListener('click', () => {
          if (!getSelection().toString()) view.input.focus();
        });
        self.input = view.input;
      },
    });
    if (alreadyOpen || innerWidth >= MIN_AUTOFOCUS_WIDTH) win.input.focus();
  }

  window.Terminal = { open };
})();
