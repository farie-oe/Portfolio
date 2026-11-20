(function () {
  const P = PORTFOLIO;
  const { paragraph, bulletList, tagList } = Apps.ui;
  const FIGURE = /(A\$\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?%)/g;

  const SECTIONS = [
    { title: () => 'Objectives', field: 'goal', render: paragraph },
    { title: () => 'Methodology', field: 'approach', render: paragraph },
    {
      title: (project) => project.featuresTitle || 'Features',
      field: 'features',
      render: bulletList,
    },
    { title: () => 'Key findings', field: 'findings', render: findingList },
    { title: () => 'Security takeaways', field: 'takeaways', render: bulletList },
    { title: () => 'Visuals', field: 'screens', render: visuals },
    { title: () => 'Reflection', field: 'reflection', render: paragraph },
    { title: () => 'Scope and limits', field: 'caveat', render: note },
    {
      title: (project) => (project.kind === 'report' ? 'Topics' : 'Tools and technologies'),
      field: 'tags',
      render: tagList,
    },
    { title: () => 'References', field: 'references', render: bulletList },
  ];

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

  function visuals(shots, project) {
    return h(
      'div',
      { class: 'shots' },
      shots.map((shot) => h('img', { src: shot.src, alt: shot.alt || project.title })),
    );
  }

  function block(title, content) {
    return content ? h('section', { class: 'rs-sec' }, h('h4', null, title), content) : null;
  }

  function header({ eyebrow, title, lede, logo, actions }) {
    return h(
      'header',
      { class: 'rs-head' },
      logo ? h('img', { class: 'rs-logo', src: logo, alt: '', draggable: 'false' }) : null,
      present(eyebrow) ? h('p', { class: 'rs-eyebrow' }, eyebrow) : null,
      h('h3', { class: 'rs-title' }, title),
      present(lede) ? h('p', { class: 'rs-lede' }, lede) : null,
      actions,
    );
  }

  function actionsFor(project) {
    const items = [];
    if (project.pdf) {
      items.push(
        h(
          'button',
          { class: 'rs-action primary', type: 'button', onclick: () => Apps.pdf(project) },
          project.pdf.label || 'View PDF',
        ),
        externalLink(project.pdf.src, { class: 'rs-action' }, 'Open in new tab ↗'),
      );
    }
    (project.links || []).forEach((link, index) => {
      const primary = !project.pdf && index === 0 ? ' primary' : '';
      items.push(externalLink(link.href, { class: 'rs-action' + primary }, link.label + ' ↗'));
    });
    return items.length ? h('div', { class: 'rs-actions' }, items) : null;
  }

  function view(project) {
    const folder = P.categories.find((category) => category.id === project.category);
    const eyebrow = [project.docType || folder.label, project.year || project.status]
      .filter(present)
      .join(' · ');
    return h(
      'div',
      { class: 'rs-doc' },
      header({
        eyebrow,
        title: project.title,
        lede: project.overview,
        logo: project.img,
        actions: actionsFor(project),
      }),
      SECTIONS.map(({ title, field, render }) => {
        const value = project[field];
        return present(value) ? block(title(project), render(value, project)) : null;
      }),
    );
  }

  window.Detail = { view, block, header };
})();
