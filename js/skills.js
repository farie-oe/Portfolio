(function () {
  const P = PORTFOLIO;
  const TONES = ['pink', 'sky', 'butter', 'mint', 'peach'];

  const toneClass = (groupIndex, skillIndex) =>
    'tone-' + TONES[(groupIndex * 2 + skillIndex) % TONES.length];

  function evidenceOf(skill) {
    const projects = (skill.projects || [])
      .map((id) => P.projects.find((project) => project.id === id))
      .filter(Boolean)
      .map((project) => ({ label: project.title, open: () => Apps.project(project.id) }));
    const certs = (skill.certs || [])
      .map((id) => P.certs.find((cert) => cert.id === id))
      .filter(Boolean)
      .map((cert) => ({ label: cert.title, open: () => Apps.cert(cert.id) }));
    return [...projects, ...certs];
  }

  function partition() {
    const split = (demonstrated) =>
      P.skills
        .map((group) => ({
          ...group,
          items: group.items.filter((skill) => evidenceOf(skill).length > 0 === demonstrated),
        }))
        .filter((group) => group.items.length > 0);
    return { demonstrated: split(true), exploring: split(false) };
  }

  function skillGroup(group, groupIndex, demonstrated) {
    const tray = h('div', { class: 'sub-tray', hidden: true, 'aria-live': 'polite' });
    let expandedPill = null;

    function collapse(pill) {
      pill.setAttribute('aria-expanded', 'false');
      pill.classList.remove('on');
    }

    function trayContent(skill) {
      const evidence = evidenceOf(skill);
      return [
        evidence.length
          ? h(
              'span',
              { class: 'evidence' },
              h('b', null, 'Evidence'),
              evidence.map((item) =>
                h(
                  'button',
                  { class: 'evidence-link', type: 'button', onclick: item.open },
                  item.label,
                ),
              ),
            )
          : null,
        (skill.sub || []).map((name, i) =>
          h('span', { class: 'sub-bubble', style: `--k:${i}` }, name),
        ),
      ];
    }

    function toggleTray(pill, skill, tone) {
      const wasExpanded = expandedPill === pill;
      if (expandedPill) collapse(expandedPill);
      if (wasExpanded) {
        expandedPill = null;
        tray.hidden = true;
        return;
      }
      expandedPill = pill;
      pill.setAttribute('aria-expanded', 'true');
      pill.classList.add('on');
      tray.className = 'sub-tray ' + tone;
      tray.replaceChildren();
      fill(tray, trayContent(skill));
      tray.hidden = false;
    }

    function pillFor(skill, skillIndex) {
      const tone = toneClass(groupIndex, skillIndex);
      const kind = demonstrated ? '' : ' exploring';
      const expandable = demonstrated || skill.sub;
      if (!expandable) return h('span', { class: 'skill-pill' + kind + ' ' + tone }, skill.name);
      return h(
        'button',
        {
          class: 'skill-pill has-sub' + kind + ' ' + tone,
          type: 'button',
          'aria-expanded': 'false',
          onclick: (event) => toggleTray(event.currentTarget, skill, tone),
        },
        skill.name,
      );
    }

    return h(
      'section',
      { class: 'stat-group' },
      h('h4', null, group.group),
      group.note && demonstrated ? h('p', { class: 'meta' }, group.note) : null,
      h(
        'ul',
        { class: 'pill-row' },
        group.items.map((skill, i) => h('li', null, pillFor(skill, i))),
      ),
      tray,
    );
  }

  function skillsPart(title, note, groups, demonstrated) {
    return h(
      'section',
      { class: 'skills-part' },
      h('h3', { class: 'skills-part-title' }, title),
      h('p', { class: 'meta' }, note),
      groups.map((group, index) => skillGroup(group, index, demonstrated)),
    );
  }

  function open() {
    const { demonstrated, exploring } = partition();
    Windows.open('skills', {
      title: 'Skills',
      ico: 'skills',
      width: 600,
      render(body) {
        body.append(
          h(
            'div',
            { class: 'profile' },
            h(
              'aside',
              { class: 'profile-side' },
              h('div', { class: 'profile-avatar' }, mIcon('about', 'profile-avatar-ico')),
              h('i', { class: 'profile-shadow', 'aria-hidden': 'true' }),
            ),
            h(
              'div',
              { class: 'profile-stats' },
              skillsPart(
                'Demonstrated skills',
                'Linked to the projects and certifications that show them. Select a skill to see its evidence.',
                demonstrated,
                true,
              ),
              skillsPart(
                'Currently exploring',
                'Skills I am learning that the portfolio cannot show yet.',
                exploring,
                false,
              ),
            ),
          ),
        );
      },
    });
  }

  window.Skills = { open, partition };
})();
