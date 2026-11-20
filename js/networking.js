(function () {
  const N = NETWORKING;
  const { paragraph, bulletList, tagList } = Apps.ui;
  const { block, header } = Detail;
  const ABOUT_KEY = 'about';

  const findCategory = (id) => N.categories.find((category) => category.id === id);

  function download(exercise) {
    const { src, name } = exercise.file;
    return h(
      'div',
      { class: 'rs-actions' },
      h(
        'a',
        { class: 'rs-action primary', href: src, download: name },
        'Download Packet Tracer file',
      ),
    );
  }

  function cell(value) {
    return Array.isArray(value) ? value.map((text) => h('div', null, text)) : value;
  }

  function table({ headers, rows }) {
    return h(
      'div',
      { class: 'nw-table-wrap' },
      h(
        'table',
        { class: 'nw-table' },
        h(
          'thead',
          null,
          h(
            'tr',
            null,
            headers.map((text) => h('th', null, text)),
          ),
        ),
        h(
          'tbody',
          null,
          rows.map((row) =>
            h(
              'tr',
              null,
              row.map((value) => h('td', null, cell(value))),
            ),
          ),
        ),
      ),
    );
  }

  function figure(topology) {
    return h(
      'figure',
      { class: 'nw-fig' },
      Topology.draw(topology),
      h(
        'figcaption',
        null,
        'Diagram generated from the original Packet Tracer topology. Layout follows the device positions in the file.',
      ),
    );
  }

  function detailBlocks(item) {
    return [
      block('Topology', figure(item.topology)),
      block('Network architecture', bulletList(item.architecture)),
      block('Implementation approach', paragraph(item.approach)),
      item.facts.map((fact) => block(fact.title, table(fact))),
    ];
  }

  function stageBlocks(stage) {
    return [
      block(stage.title, h('div', null, paragraph(stage.summary), download(stage))),
      detailBlocks(stage),
    ];
  }

  function stagedBlocks(exercise) {
    const panel = h('div', { role: 'tabpanel' });
    const tabs = exercise.stages.map((stage, index) =>
      h(
        'button',
        { class: 'nw-tab', type: 'button', role: 'tab', onclick: () => select(index) },
        `${index + 1} · ${stage.title}`,
      ),
    );
    function select(index) {
      tabs.forEach((tab, position) => {
        tab.classList.toggle('on', position === index);
        tab.setAttribute('aria-selected', String(position === index));
      });
      panel.replaceChildren();
      fill(panel, stageBlocks(exercise.stages[index]));
    }
    select(0);
    return [
      block(
        'Stages',
        h('div', { class: 'nw-tabs', role: 'tablist', 'aria-label': 'Stages' }, tabs),
      ),
      panel,
    ];
  }

  function exerciseView(category, exercise) {
    const staged = Boolean(exercise.stages);
    return h(
      'div',
      { class: 'rs-doc' },
      header({
        eyebrow: `${category.kind} · ${category.title}`,
        title: exercise.title,
        lede: exercise.summary,
        actions: staged ? null : download(exercise),
      }),
      staged ? stagedBlocks(exercise) : detailBlocks(exercise),
    );
  }

  function aboutView(category) {
    return h(
      'div',
      { class: 'rs-doc' },
      header({ eyebrow: category.kind, title: category.title, lede: category.overview }),
      block('What it involved', bulletList(category.involved)),
      block('Concepts', tagList(category.concepts)),
      block('Approach', paragraph(category.approach)),
    );
  }

  function entries(categoryId) {
    const category = findCategory(categoryId);
    return [
      { key: ABOUT_KEY, label: 'About', icon: 'file-word' },
      ...category.exercises.map((exercise) => ({
        key: exercise.id,
        label: exercise.title,
        icon: 'network',
      })),
    ];
  }

  function view(categoryId, key) {
    const category = findCategory(categoryId);
    if (key === ABOUT_KEY) return aboutView(category);
    return exerciseView(
      category,
      category.exercises.find((exercise) => exercise.id === key),
    );
  }

  PORTFOLIO.projects.push(
    ...N.categories.map((category) => ({
      id: 'networking-' + category.id,
      category: 'networking',
      title: category.title,
      kind: 'networking',
      networking: category.id,
      ico: 'network',
      tone: 'c',
      status: 'Lab',
      overview: category.summary,
      tags: ['Cisco Packet Tracer', category.kind],
      links: [],
    })),
  );

  window.Networking = { entries, view };
})();
