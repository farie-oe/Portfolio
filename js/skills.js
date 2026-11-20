(function () {
  const TONES = ['pink', 'sky', 'butter', 'mint', 'peach'];

  const toneClass = (groupIndex, skillIndex) =>
    'tone-' + TONES[(groupIndex * 2 + skillIndex) % TONES.length];

  function skillGroup(group, groupIndex) {
    const tray = h('div', { class: 'sub-tray', hidden: true, 'aria-live': 'polite' });
    let expandedPill = null;

    function collapse(pill) {
      pill.setAttribute('aria-expanded', 'false');
      pill.classList.remove('on');
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
      tray.replaceChildren(
        ...skill.sub.map((name, i) => h('span', { class: 'sub-bubble', style: `--k:${i}` }, name)),
      );
      tray.hidden = false;
    }

    function pillFor(skill, skillIndex) {
      const tone = toneClass(groupIndex, skillIndex);
      if (!skill.sub) return h('span', { class: 'skill-pill ' + tone }, skill.name);
      return h(
        'button',
        {
          class: 'skill-pill has-sub ' + tone,
          type: 'button',
          'aria-expanded': 'false',
          onclick: (event) => toggleTray(event.currentTarget, skill, tone),
        },
        skill.name,
      );
    }

    const pills = group.items.map((skill, i) => h('li', null, pillFor(skill, i)));
    return h(
      'section',
      { class: 'stat-group' },
      h('h3', null, group.group),
      group.note ? h('p', { class: 'meta' }, group.note) : null,
      h('ul', { class: 'pill-row' }, pills),
      tray,
    );
  }

  function open() {
    Windows.open('skills', {
      title: 'Skills',
      ico: 'skills',
      width: 580,
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
            h('div', { class: 'profile-stats' }, PORTFOLIO.skills.map(skillGroup)),
          ),
        );
      },
    });
  }

  window.Skills = { open };
})();
