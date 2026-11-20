(function () {
  const P = PORTFOLIO;
  const USER = `${P.owner.handle}@${P.owner.host}`;
  const HOME = '~';
  const WINDOW_APPS = P.apps
    .filter((app) => app.id !== 'terminal' && app.id !== 'flags')
    .map((app) => app.id);

  const LEGACY_PROJECTS_DIR = 'work';
  const HELP_NAME_WIDTH = 16;
  const PROJECT_NAME_WIDTH = 24;
  const MAX_TYPO_DISTANCE = 2;
  const MAX_SUGGESTIONS = 3;
  const SWATCH_TONES = ['pink', 'butter', 'mint', 'sky', 'peach'];

  const FORTUNES = [
    'A strong password is long, unique and not "password123".',
    "There is no cloud. It is just someone else's computer.",
    'The best time to turn on MFA was yesterday. The second best time is now.',
    'Never trust user input. Not even your own.',
    'Phishing is just social engineering with better stationery.',
    'Security is a process, not a product.',
    'A patch applied today is an incident avoided tomorrow.',
    'The weakest link is usually the one nobody documented.',
  ];
  const COFFEE = [
    '      ) )',
    '     ( (',
    '   ........',
    '   |      |]',
    '   \\      /',
    "    `----'",
  ];

  const HELP_SECTIONS = [
    {
      title: 'Portfolio',
      rows: [
        ['whoami', 'a short introduction'],
        ['about', 'about me'],
        ['skills', 'what I work with'],
        ['projects', 'things I have made (pick one to explore)'],
        ['education', 'university and degree'],
        ['certifications', 'my certifications (also: certs)'],
        ['experience', 'programs and simulations'],
        ['contact', 'how to reach me'],
        ['neofetch', 'a little profile summary'],
      ],
    },
    {
      title: 'Around the terminal',
      rows: [
        'ls [-la] [dir]  list files; -a shows hidden ones',
        'cd <dir>        change directory (cd .., cd projects, cd certs)',
        'cat <file>      read a file, e.g. cat about.txt',
        'pwd             where am I?',
        'open <window>   open: ' + WINDOW_APPS.join(', '),
        ['date', "today's date and time"],
        ['clear', 'tidy up (or press Ctrl+L)'],
      ],
    },
    {
      title: 'Flag hunt',
      rows: [
        ['flags', 'your progress'],
        ['hint', 'clues for flags you have not found'],
        'submit <flag>   hand in a flag: submit flag{...}',
      ],
    },
  ];

  const tree = {
    [HOME]: {
      dirs: ['projects', 'certs'],
      files: ['about.txt', 'skills.txt', 'contact.txt', 'note.txt'],
      hidden: ['.secret'],
    },
    '~/projects': { dirs: P.categories.map((category) => category.dir), files: [] },
    '~/certs': { dirs: [], files: P.certs.map((cert) => cert.id + '.txt') },
  };
  const readers = {};

  const indent = (items) => items.map((item) => '  - ' + item);
  const hasItems = (list) => Boolean(list && list.length);

  function projectLines(project) {
    const out = [[project.title, 'strong'], project.overview];
    if (project.goal) out.push('Goal: ' + project.goal);
    if (project.approach) out.push('Approach: ' + project.approach);
    if (hasItems(project.features)) out.push('Features:', ...indent(project.features));
    if (hasItems(project.findings)) out.push('Key findings:', ...indent(project.findings));
    if (hasItems(project.takeaways)) out.push('Security takeaways:', ...indent(project.takeaways));
    if (project.pdf) out.push([`PDF: ${project.pdf.src}`, 'dim']);
    if (project.caveat) out.push(['Scope and limits: ' + project.caveat, 'dim']);
    out.push(['Tools: ' + project.tags.join(', '), 'dim']);
    (project.links || []).forEach((link) => out.push([`${link.label}: ${link.href}`, 'dim']));
    return out;
  }

  const certLines = (cert) => [
    [cert.title, 'strong'],
    cert.issuer,
    ...cert.details.map(([label, value]) => `${label}: ${value}`),
  ];

  P.categories.forEach((category) => {
    const projects = P.projects.filter((project) => project.category === category.id);
    tree[`~/projects/${category.dir}`] = { dirs: [], files: projects.map((p) => p.id + '.txt') };
    projects.forEach((project) => {
      readers[`~/projects/${category.dir}/${project.id}.txt`] = () => projectLines(project);
    });
  });
  P.certs.forEach((cert) => {
    readers[`~/certs/${cert.id}.txt`] = () => certLines(cert);
  });

  readers['~/about.txt'] = () => [[P.about.greeting, 'strong'], ...P.about.paragraphs];
  readers['~/skills.txt'] = () =>
    P.skills.flatMap((group) => [
      [group.group, 'strong'],
      '  ' + group.items.map((skill) => skill.name).join(', '),
    ]);
  readers['~/contact.txt'] = () =>
    P.contact.links.map((link) => `${link.label.padEnd(9)} ${link.value}`);
  readers['~/note.txt'] = () => [
    'Hey you! You found the note. Here is a flag for reading it:',
    [Flags.reveal('rot13').flag, 'strong'],
  ];
  readers['~/.secret'] = () => [[Flags.reveal('dotfile').flag, 'strong']];

  function resolvePath(arg, base) {
    const fromHome = arg === '~' || arg.startsWith('~/');
    const start = fromHome ? [HOME] : base.split('/');
    const relative = arg.startsWith('~/') ? arg.slice(2) : arg;
    const parts = arg === '~' ? [] : relative.split('/');
    const resolved = [...start];
    parts.forEach((part) => {
      if (!part || part === '.') return;
      if (part !== '..') resolved.push(part);
      else if (resolved.length > 1) resolved.pop();
    });
    if (resolved[1] === LEGACY_PROJECTS_DIR) resolved[1] = 'projects';
    return resolved.join('/');
  }

  let cwd = HOME;

  function printLines(ctx, list) {
    list.forEach((line) => (Array.isArray(line) ? ctx.print(line[0], line[1]) : ctx.print(line)));
  }

  function education() {
    const row = P.about.facts.find(([label]) => label === 'Education');
    return row ? [].concat(row[1]) : [];
  }

  function findProject(query) {
    return P.projects.find((p) => p.id === query || p.title.toLowerCase() === query);
  }

  function printHelp(ctx) {
    HELP_SECTIONS.forEach(({ title, rows }) => {
      ctx.print(title, 'strong');
      rows.forEach((row) => {
        if (typeof row === 'string') return ctx.print(row);
        const [name, description] = row;
        ctx.row('', name, name, description, HELP_NAME_WIDTH - name.length);
      });
    });
    ctx.print(
      'Tab completes commands, the arrow keys bring back old ones. There may be a few secrets in here too.',
      'dim',
    );
  }

  function printContactLinks(ctx) {
    P.contact.links.forEach((link) => {
      const anchor = externalLink(
        link.href,
        { class: 'term-link', target: link.href.startsWith('mailto:') ? null : '_blank' },
        link.value,
      );
      ctx.printNode(h('div', { class: 'out' }, link.label.padEnd(9) + ' ', anchor));
    });
  }

  function uptimeText() {
    const seconds = Math.round(performance.now() / 1000);
    return seconds < 60 ? `${seconds} secs` : `${Math.floor(seconds / 60)} mins`;
  }

  function printNeofetch(ctx) {
    const [university = '', degree = ''] = education();
    const certified = P.certs
      .filter((cert) => cert.status === 'Certified')
      .map((cert) => cert.title)
      .join(', ');
    const fact = (key, value) =>
      h('div', null, h('span', { class: 'neo-key' }, key.padEnd(11)), value);
    ctx.printNode(
      h(
        'div',
        { class: 'neo' },
        mIcon('about', 'neo-avatar'),
        h(
          'div',
          { class: 'neo-info' },
          h('div', { class: 'neo-key' }, USER),
          h('div', { class: 'neo-rule' }, '-'.repeat(USER.length)),
          fact('OS', P.owner.labName),
          fact('Shell', 'kawaii-sh (simulated)'),
          fact('Uptime', uptimeText()),
          fact('University', university),
          fact('Degree', degree),
          fact('Focus', 'Cryptography, Networking, Secure coding, GRC'),
          fact('Certified', certified),
          fact('Flags', `${Flags.count()} of ${Flags.total()} found`),
          h(
            'div',
            { class: 'neo-swatches', 'aria-hidden': 'true' },
            SWATCH_TONES.map((tone) => h('i', { style: `background:var(--pastel-${tone}-edge)` })),
          ),
        ),
      ),
    );
  }

  function listDirectory(ctx, arg) {
    const tokens = arg.split(/\s+/).filter(Boolean);
    const options = tokens.filter((token) => token.startsWith('-')).join('');
    const requested = tokens.find((token) => !token.startsWith('-'));
    const target = resolvePath(requested || '', cwd);
    const node = tree[target];
    if (!node) {
      if (readers[target]) return ctx.print(target.split('/').pop());
      return ctx.print(`ls: cannot access '${requested}': No such file or directory`, 'err');
    }
    const showAll = options.includes('a');
    const entries = [
      ...(showAll
        ? [
            { name: '.', dir: true },
            { name: '..', dir: true },
          ]
        : []),
      ...node.dirs.map((name) => ({ name, dir: true })),
      ...node.files.map((name) => ({ name })),
      ...(showAll ? (node.hidden || []).map((name) => ({ name })) : []),
    ];
    const label = (entry) => entry.name + (entry.dir && entry.name.length > 2 ? '/' : '');
    if (options.includes('l')) {
      entries.forEach((entry) => {
        const mode = entry.dir ? 'drwxr-xr-x' : '-rw-r--r--';
        ctx.print(`${mode}  ${P.owner.handle}  ${label(entry)}`);
      });
    } else {
      ctx.print(entries.map(label).join('   '));
    }
  }

  function findReader(name, path) {
    if (readers[path]) return readers[path];
    const id = name.replace(/\.txt$/, '');
    const key = Object.keys(readers).find((candidate) => candidate.endsWith(`/${id}.txt`));
    return key ? readers[key] : null;
  }

  function submitFlag(ctx, text) {
    if (!text) return ctx.print('usage: submit flag{...}', 'err');
    const result = Flags.submit(text);
    if (result === 'ok') ctx.print('[x] Correct. Flag saved.', 'ok');
    else if (result === 'dup') ctx.print('You already have that one.', 'dim');
    else ctx.print('[!] That is not a flag. Keep looking.', 'err');
  }

  const commands = {
    help: printHelp,
    whoami(ctx) {
      ctx.print(P.owner.name, 'strong');
      ctx.print(P.owner.tagline);
      const degree = education();
      if (degree.length) ctx.print(degree.join(', '), 'dim');
    },
    about(ctx) {
      printLines(ctx, readers['~/about.txt']());
    },
    skills(ctx) {
      P.skills.forEach((group) => {
        ctx.print(group.group, 'strong');
        group.items.forEach((skill) => {
          const detail = skill.sub ? ': ' + skill.sub.join(', ') : '';
          ctx.print('  - ' + skill.name + detail);
        });
      });
    },
    education(ctx) {
      ctx.print('Education', 'strong');
      education().forEach((line) => ctx.print('  ' + line));
    },
    certifications(ctx) {
      ctx.print('Certifications', 'strong');
      P.certs
        .filter((cert) => cert.type === 'certification')
        .forEach((cert) => ctx.row('  [x] ', cert.title, 'cat ' + cert.id, `(${cert.issuer})`, 2));
      ctx.print('Pick one to see the details.', 'dim');
    },
    experience(ctx) {
      ctx.print('Experience & Programmes', 'strong');
      const completed = P.certs.filter((cert) => cert.type === 'programme');
      if (completed.length === 0) return ctx.print('Nothing listed yet.', 'dim');
      completed.forEach((cert) => {
        ctx.row('  - ', cert.title, 'cat ' + cert.id, `(${cert.issuer})`, 2);
        ctx.print('      ' + cert.blurb, 'dim');
      });
    },
    projects(ctx, arg) {
      if (arg) return commands.project(ctx, arg);
      ctx.print('~/projects', 'strong');
      P.categories.forEach((category) => {
        ctx.print(category.dir + '/', 'strong');
        P.projects
          .filter((project) => project.category === category.id)
          .forEach((project) => {
            const summary = `${project.title}  [${project.status}]`;
            const padding = PROJECT_NAME_WIDTH - project.id.length;
            ctx.row('  ', project.id, 'project ' + project.id, summary, padding);
          });
      });
      ctx.print('Click a project, or type: project <name>', 'dim');
    },
    project(ctx, arg) {
      const query = arg.trim().replace(/\.txt$/, '');
      const project = findProject(query);
      if (!project) {
        const usage = query
          ? `project: "${query}" not found. Type projects to see them.`
          : 'usage: project <name>. Type projects to see them.';
        return ctx.print(usage, 'err');
      }
      printLines(ctx, projectLines(project));
      ctx.print('');
      const openInWindow = ctx.link('[open in a window]', () => Apps.project(project.id));
      ctx.printNode(h('div', { class: 'out' }, openInWindow));
    },
    contact(ctx) {
      ctx.print(P.contact.intro, 'dim');
      printContactLinks(ctx);
    },
    neofetch: printNeofetch,
    date(ctx) {
      const format = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      };
      ctx.print(new Date().toLocaleString([], format));
    },
    pwd(ctx) {
      ctx.print(cwd.replace(HOME, '/home/' + P.owner.handle));
    },
    clear(ctx) {
      ctx.clear();
    },
    ls: listDirectory,
    cd(ctx, arg) {
      const target = arg.trim() ? resolvePath(arg.trim(), cwd) : HOME;
      if (!tree[target]) {
        const reason = readers[target] ? 'Not a directory' : 'No such file or directory';
        return ctx.print(`cd: ${arg}: ${reason}`, 'err');
      }
      cwd = target;
    },
    cat(ctx, arg) {
      const name = arg.trim();
      if (!name) return ctx.print('cat: which file? Try cat about.txt', 'err');
      const path = resolvePath(name, cwd);
      const read = findReader(name, path);
      if (!read) {
        const reason = tree[path] ? 'Is a directory' : 'No such file or directory';
        return ctx.print(`cat: ${name}: ${reason}`, 'err');
      }
      printLines(ctx, read());
    },
    open(ctx, arg) {
      if (WINDOW_APPS.includes(arg) || arg === LEGACY_PROJECTS_DIR) return Apps.open(arg);
      const message = arg
        ? `open: no such window "${arg}"`
        : 'open: which one? ' + WINDOW_APPS.join(', ');
      ctx.print(message, 'err');
    },
    flags(ctx) {
      ctx.print(`Flags found: ${Flags.count()} of ${Flags.total()}`, 'strong');
      Flags.all().forEach((flag, index) => {
        const found = Flags.isFound(flag);
        ctx.print(found ? `[x] ${flag.flag}` : `[ ] Flag ${index + 1}`, found ? 'ok' : 'dim');
      });
      if (Flags.remaining()) {
        ctx.print('Type "hint" for clues, or open Flag Hunt from the dock.', 'dim');
      }
    },
    hint(ctx) {
      const missing = Flags.all().filter((flag) => !Flags.isFound(flag));
      if (missing.length === 0) {
        return ctx.print('You have every flag. Nothing left to hint at.', 'ok');
      }
      missing.forEach((flag) => {
        ctx.print(`Flag ${Flags.all().indexOf(flag) + 1}: ${flag.clue}`);
      });
      ctx.print('Open Flag Hunt in the dock for progressive hints.', 'dim');
    },
    submit: submitFlag,
    echo(ctx, arg, raw) {
      ctx.print(raw);
    },
    sudo(ctx, arg) {
      if (arg.replace(/\s+/g, ' ').trim() !== 'hire mafaro') {
        return ctx.print(
          `${USER} is not in the sudoers file. This incident will be reported.`,
          'err',
        );
      }
      ctx.print('[sudo] password for recruiter: ********', 'dim');
      ctx.print('Access granted.', 'ok');
      ctx.print("Great call. Let's talk:", 'strong');
      printContactLinks(ctx);
    },
    rm(ctx) {
      ctx.print('rm: this portfolio is read-only. Nice try.', 'err');
    },
    coffee(ctx) {
      COFFEE.forEach((line) => ctx.print(line));
      ctx.print('Brewing... done. Focus restored, bugs unchanged.', 'ok');
    },
    fortune(ctx) {
      ctx.print(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'strong');
    },
    exit() {
      Windows.close('terminal');
    },
  };

  Object.assign(commands, {
    work: commands.projects,
    cert: commands.certifications,
    certs: commands.certifications,
    dir: commands.ls,
    edu: commands.education,
    exp: commands.experience,
  });

  const NOT_LISTED = [
    'sudo',
    'rm',
    'certs',
    'coffee',
    'fortune',
    'echo',
    'work',
    'cert',
    'dir',
    'edu',
    'exp',
    'exit',
    'project',
  ];
  const listedCommands = Object.keys(commands).filter((name) => !NOT_LISTED.includes(name));

  function editDistance(a, b) {
    const table = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) table[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const substitution = a[i - 1] === b[j - 1] ? 0 : 1;
        table[i][j] = Math.min(
          table[i - 1][j] + 1,
          table[i][j - 1] + 1,
          table[i - 1][j - 1] + substitution,
        );
      }
    }
    return table[a.length][b.length];
  }

  function suggestCommands(name) {
    return listedCommands
      .map((command) => {
        const related = command.startsWith(name) || name.startsWith(command);
        return [command, related ? 0 : editDistance(name, command)];
      })
      .filter(([, distance]) => distance <= MAX_TYPO_DISTANCE)
      .sort((a, b) => a[1] - b[1])
      .slice(0, MAX_SUGGESTIONS)
      .map(([command]) => command);
  }

  function argumentChoices(command) {
    const here = tree[cwd] || { dirs: [], files: [] };
    const projectIds = P.projects.map((project) => project.id);
    if (command === 'open') return WINDOW_APPS;
    if (command === 'project' || command === 'projects') return projectIds;
    if (command === 'cd' || command === 'ls') return [...here.dirs, '..', '~'];
    if (command === 'cat') return [...here.files, ...projectIds, ...P.certs.map((c) => c.id)];
    return [];
  }

  function run(line, ctx) {
    const [first, ...rest] = line.split(/\s+/);
    const name = first.toLowerCase();
    const raw = rest.join(' ');
    const command = Object.hasOwn(commands, name) ? commands[name] : null;
    if (command) return command(ctx, raw.toLowerCase(), raw);

    ctx.print(`command not found: ${first}`, 'err');
    const suggestions = suggestCommands(name);
    ctx.print(
      suggestions.length
        ? `Did you mean: ${suggestions.join(', ')}?`
        : 'Type "help" to see what is available.',
      'dim',
    );
  }

  window.TerminalShell = {
    user: USER,
    listedCommands,
    run,
    argumentChoices,
    currentDirectory: () => cwd,
  };
})();
