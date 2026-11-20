(function () {
  const P = PORTFOLIO;
  const PDF_INLINE_MIN_WIDTH = 700;

  const tag = (name) => h('span', { class: 'tag' }, name);
  const tagList = (tags) =>
    tags && tags.length ? h('div', { class: 'tags' }, tags.map(tag)) : null;
  const bulletList = (items) =>
    items && items.length
      ? h(
          'ul',
          { class: 'bullets' },
          items.map((item) => h('li', null, item)),
        )
      : null;
  const paragraph = (text) => (text ? h('p', null, text) : null);
  const buttonLink = ({ href, label }) => externalLink(href, { class: 'btn small' }, label + ' ↗');
  const lines = (value) => [].concat(value).flatMap((text, i) => (i ? [h('br'), text] : [text]));
  const projectDir = (project) => P.categories.find((c) => c.id === project.category).dir;

  function section(title, ...kids) {
    const content = kids.flat().filter(Boolean);
    if (content.length === 0) return null;
    return h('section', { class: 'detail-sec' }, h('h4', null, title), content);
  }

  function thumbnail(item) {
    const picture = item.ico
      ? mIcon(item.ico, 'thumb-img')
      : h('img', { class: 'thumb-img', src: item.img, alt: '', draggable: 'false' });
    return h('div', { class: 'thumb' + (item.tone ? ' t-' + item.tone : '') + ' big' }, picture);
  }

  function detailWindow({ id, item, dir, windowIcon, showThumbnail, sections }) {
    Windows.open(id, {
      ...windowIcon,
      title: item.title,
      width: 480,
      dir,
      cmd: `cat ${item.id}.txt`,
      render(body) {
        const links = item.links && item.links.length ? item.links : null;
        fill(
          body,
          showThumbnail ? thumbnail(item) : null,
          h(
            'div',
            { class: 'row-between' },
            h('h3', null, item.title),
            h('span', { class: 'pill' }, item.status),
          ),
          ...sections.filter(Boolean),
          links ? h('div', { class: 'btn-row' }, links.map(buttonLink)) : null,
        );
      },
    });
  }

  function pdfWindow(project) {
    const { src } = project.pdf;
    if (innerWidth < PDF_INLINE_MIN_WIDTH || navigator.pdfViewerEnabled === false) {
      window.open(src, '_blank', 'noopener');
      return;
    }
    Windows.open('research-pdf-' + project.id, {
      title: project.title + ' (PDF)',
      ico: 'file-pdf',
      width: 900,
      render(body) {
        body.classList.add('pdf-body');
        const fallback = h(
          'p',
          { class: 'lead', style: 'padding:20px' },
          'This browser cannot show the PDF here. ',
          externalLink(src, null, 'Open it in a new tab'),
          '.',
        );
        fill(
          body,
          h('div', { class: 'pdf-bar' }, buttonLink({ label: 'Open in new tab', href: src })),
          h(
            'object',
            {
              class: 'pdf-frame',
              data: src + '#view=FitH',
              type: 'application/pdf',
              'aria-label': project.title + ' PDF',
            },
            fallback,
          ),
        );
      },
    });
  }

  function reportWindow(report) {
    Windows.open('report-' + report.id, {
      title: report.title,
      ico: 'file-pdf',
      width: 500,
      dir: '~/work/' + projectDir(report),
      cmd: `cat ${report.id}.txt`,
      render(body) {
        fill(
          body,
          h(
            'div',
            { class: 'report-head' },
            mIcon('file-pdf'),
            h(
              'div',
              null,
              h('h3', null, report.title),
              h('span', { class: 'pill' }, report.status),
            ),
          ),
          h('p', { class: 'report-hook' }, report.hook || report.overview),
          report.caveat ? h('p', { class: 'meta' }, report.caveat) : null,
          tagList(report.tags),
        );
      },
    });
  }

  function projectSections(project) {
    const screenshots = project.screens && project.screens.length ? project.screens : null;
    return [
      section('Overview', paragraph(project.overview)),
      section('Goal', paragraph(project.goal)),
      section('Approach', paragraph(project.approach)),
      section(project.featuresTitle || 'Features', bulletList(project.features)),
      section('Key findings', bulletList(project.findings)),
      section('Security takeaways', bulletList(project.takeaways)),
      section('Scope and limits', paragraph(project.caveat)),
      section('Tools and technologies', tagList(project.tags)),
      section(
        'Screenshots',
        screenshots &&
          h(
            'div',
            { class: 'shots' },
            screenshots.map((shot) => h('img', { src: shot.src, alt: shot.alt || project.title })),
          ),
      ),
    ];
  }

  function projectWindow(project) {
    if (project.kind === 'report') return reportWindow(project);
    detailWindow({
      id: 'project-' + project.id,
      item: project,
      dir: '~/work/' + projectDir(project),
      windowIcon: { ico: project.ico, img: project.img },
      showThumbnail: true,
      sections: projectSections(project),
    });
  }

  function certWindow(cert) {
    const image = cert.img
      ? h('img', { class: 'cert-full', src: cert.img, alt: cert.title + ' certificate' })
      : null;
    const facts = h(
      'dl',
      { class: 'facts' },
      cert.details.map(([label, value]) => [h('dt', null, label), h('dd', null, value)]),
    );
    detailWindow({
      id: 'cert-' + cert.id,
      item: cert,
      dir: '~/certs',
      windowIcon: { ico: cert.ico || 'certs' },
      showThumbnail: false,
      sections: [h('p', { class: 'lead' }, cert.issuer), image, facts],
    });
  }

  function certTile(cert) {
    return h(
      'button',
      {
        class: 'cert-tile',
        type: 'button',
        onclick: () => certWindow(cert),
        'aria-label': cert.title,
      },
      h('img', { src: cert.img, alt: '', loading: 'lazy', draggable: 'false' }),
      h('span', null, cert.title),
    );
  }

  function openCerts() {
    Windows.open('certs', {
      title: 'Certs',
      ico: 'certs',
      width: 520,
      dir: '~/certs',
      cmd: 'ls -l',
      render(body) {
        fill(body, h('div', { class: 'cert-grid' }, P.certs.map(certTile)));
      },
    });
    Bus.emit('open:certs');
  }

  function openAbout() {
    const { greeting, paragraphs, facts } = P.about;
    Windows.open('about', {
      title: 'About',
      ico: 'about',
      width: 460,
      dir: '~',
      cmd: 'cat about.txt',
      render(body) {
        fill(
          body,
          h('div', { class: 'avatar', 'aria-hidden': 'true' }, mIcon('about')),
          h('h3', null, greeting),
          h('p', { class: 'meta' }, P.owner.name + ' / ' + P.owner.tagline),
          h('div', { style: 'margin-top:12px' }, paragraphs.map(paragraph)),
          h(
            'dl',
            { class: 'facts about-table' },
            facts.map(([label, value]) => [h('dt', null, label), h('dd', null, lines(value))]),
          ),
        );
      },
    });
  }

  function contactRow(contact) {
    return h(
      'li',
      null,
      externalLink(
        contact.href,
        { class: 'card row', 'aria-label': `${contact.label}: ${contact.value}` },
        mIcon(contact.ico, 'row-ico'),
        h('span', null, h('strong', null, contact.label), h('small', null, contact.value)),
      ),
    );
  }

  function openContact() {
    Windows.open('contact', {
      title: 'Contact',
      ico: 'contact',
      width: 420,
      dir: '~',
      cmd: 'cat contact.txt',
      render(body) {
        fill(
          body,
          h('p', null, P.contact.intro),
          h('ul', { class: 'contacts' }, P.contact.links.map(contactRow)),
        );
      },
    });
  }

  const openers = {
    terminal: () => Terminal.open(),
    work: () => Explorer.open(),
    certs: openCerts,
    skills: () => Skills.open(),
    research: () => Research.open(),
    about: openAbout,
    contact: openContact,
    flags: () => Flags.showPanel(),
  };

  window.Apps = {
    open(id) {
      openers[id]?.();
    },
    project(id) {
      const project = P.projects.find((candidate) => candidate.id === id);
      if (project.kind === 'networking') Explorer.open([project.category, project.id]);
      else if (Research.lists(project)) Research.open(project.id);
      else projectWindow(project);
    },
    pdf: pdfWindow,
    ui: { paragraph, bulletList, tagList },
  };
})();
