(function () {
  const P = PORTFOLIO;
  const { paragraph, bulletList, tagList } = Apps.ui;
  const CARD_TAG_LIMIT = 3;
  const FIGURE = /(A\$\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?%)/g;

  const SECTIONS = [
    { title: () => 'Objectives', field: 'goal', render: paragraph },
    { title: () => 'Methodology', field: 'approach', render: paragraph },
    { title: (entry) => entry.featuresTitle || 'Contents', field: 'features', render: bulletList },
    { title: () => 'Key findings', field: 'findings', render: findingList },
    { title: () => 'Security takeaways', field: 'takeaways', render: bulletList },
    { title: () => 'Visuals', field: 'screens', render: visuals },
    { title: () => 'Reflection', field: 'reflection', render: paragraph },
    { title: () => 'Scope and limits', field: 'caveat', render: note },
    { title: () => 'Topics', field: 'tags', render: tagList },
    { title: () => 'References', field: 'references', render: bulletList },
  ];

  let body = null;

  const lists = (project) => Boolean(project && project.kind === 'report' && project.pdf);
  const entries = () => P.projects.filter(lists);
  const docType = (entry) => entry.docType || entry.status;

  function present(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value != null;
  }

  function emphasise(text) {
    return text
      .split(FIGURE)
      .map((part, index) => (index % 2 ? h('strong', { class: 'rs-fig' }, part) : part));
  }

  function findingList(findings) {
    return h(
      'ol',
      { class: 'rs-findings' },
      findings.map((finding) => h('li', null, h('span', null, emphasise(finding)))),
    );
  }

  function note(text) {
    return h('p', { class: 'rs-note' }, text);
  }

  function visuals(shots, entry) {
    return h(
      'div',
      { class: 'shots' },
      shots.map((shot) => h('img', { src: shot.src, alt: shot.alt || entry.title })),
    );
  }

  function block(entry, { title, field, render }) {
    const value = entry[field];
    if (!present(value)) return null;
    const content = render(value, entry);
    return content ? h('section', { class: 'rs-sec' }, h('h4', null, title(entry)), content) : null;
  }

  function card(entry) {
    return h(
      'button',
      { class: 'card rs-card', type: 'button', 'data-id': entry.id, onclick: () => show(entry.id) },
      h(
        'span',
        { class: 'rs-meta' },
        h('span', { class: 'pill' }, docType(entry)),
        present(entry.year) ? h('span', null, entry.year) : null,
      ),
      h('strong', null, entry.title),
      present(entry.overview) ? h('small', null, entry.overview) : null,
      present(entry.tags) ? tagList(entry.tags.slice(0, CARD_TAG_LIMIT)) : null,
      h('span', { class: 'rs-view' }, 'View ›'),
    );
  }

  function render(...parts) {
    body.replaceChildren();
    fill(body, parts);
    body.scrollTop = 0;
  }

  function drawList(focusId) {
    const items = entries();
    render(
      items.length
        ? h('div', { class: 'rs-grid' }, items.map(card))
        : h('p', { class: 'meta' }, 'Nothing here yet.'),
    );
    if (focusId) body.querySelector(`[data-id="${focusId}"]`)?.focus({ preventScroll: true });
  }

  function actions(entry) {
    return h(
      'div',
      { class: 'rs-actions' },
      h(
        'button',
        { class: 'rs-action primary', type: 'button', onclick: () => Apps.pdf(entry) },
        entry.pdf.label || 'View PDF',
      ),
      externalLink(entry.pdf.src, { class: 'rs-action' }, 'Open in new tab ↗'),
    );
  }

  function header(entry) {
    const eyebrow = [docType(entry), entry.year].filter(present).join(' · ');
    return h(
      'header',
      { class: 'rs-head' },
      present(eyebrow) ? h('p', { class: 'rs-eyebrow' }, eyebrow) : null,
      h('h3', { class: 'rs-title' }, entry.title),
      present(entry.overview) ? h('p', { class: 'rs-lede' }, entry.overview) : null,
      actions(entry),
    );
  }

  function drawDetail(entry) {
    render(
      h(
        'div',
        { class: 'rs-doc' },
        h(
          'button',
          { class: 'rs-back', type: 'button', onclick: () => drawList(entry.id) },
          '‹ All research',
        ),
        header(entry),
        SECTIONS.map((section) => block(entry, section)),
      ),
    );
    body.querySelector('.rs-back').focus({ preventScroll: true });
  }

  function show(id) {
    const entry = entries().find((candidate) => candidate.id === id);
    if (entry) drawDetail(entry);
    else drawList();
  }

  function open(id) {
    Windows.open('research', {
      title: 'Research',
      ico: 'file-pdf',
      width: 720,
      onClose() {
        body = null;
      },
      render(winBody) {
        body = winBody;
        drawList();
      },
    });
    if (id) show(id);
  }

  window.Research = { open, lists };
})();
