(function () {
  const SKILLS = ['Cryptography', 'Networking', 'Secure software coding', 'GRC'];

  function skillChip(skill, index) {
    return h(
      'button',
      {
        class: 'welcome-chip',
        type: 'button',
        style: `--i:${index}`,
        onclick: () => Apps.open('skills'),
      },
      skill,
    );
  }

  function hero() {
    return h(
      'div',
      { class: 'welcome-hero' },
      h('span', { class: 'welcome-kitten' }, mIcon('about', 'welcome-kitten-ico')),
      ['s1', 's2', 's3'].map((position) =>
        h('span', { class: `welcome-spark ${position}`, 'aria-hidden': 'true' }),
      ),
    );
  }

  function open() {
    Windows.open('welcome', {
      title: 'Welcome',
      ico: 'about',
      width: 440,
      center: true,
      render(body, win) {
        const startButton = h(
          'button',
          { class: 'btn', type: 'button', onclick: () => Windows.close('welcome') },
          'Start exploring',
        );
        body.append(
          h(
            'div',
            { class: 'welcome' },
            hero(),
            h('h3', { class: 'welcome-title' }, 'Welcome to my portfolio!'),
            h('p', null, "Hi, I'm Mafaro, a cybersecurity student with experience in:"),
            h('div', { class: 'welcome-chips' }, SKILLS.map(skillChip)),
            h(
              'p',
              null,
              'I love mixing security with cuteness, and I build side projects that show off my love for design.',
            ),
            h(
              'p',
              { class: 'welcome-flag' },
              mIcon('flag', 'welcome-flag-ico'),
              h(
                'span',
                null,
                'Explore around and try to capture the flags while you are at it. Have fun!',
              ),
            ),
            h('div', { class: 'btn-row' }, startButton),
          ),
        );
        win.input = startButton;
      },
    });
  }

  window.Welcome = { open };
})();
