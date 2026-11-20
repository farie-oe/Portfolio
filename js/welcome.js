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
          { class: 'btn welcome-start', type: 'button', onclick: () => Windows.close('welcome') },
          'Start exploring',
        );
        body.append(
          h(
            'div',
            { class: 'welcome' },
            hero(),
            h('h3', { class: 'welcome-title' }, 'Welcome to my portfolio!'),
            h(
              'p',
              { class: 'welcome-intro' },
              "Hi, I'm Mafaro, a cybersecurity student. This portfolio brings together my work and learning across cryptography, networking, secure software development and GRC.",
            ),
            h('div', { class: 'welcome-chips' }, SKILLS.map(skillChip)),
            h(
              'p',
              { class: 'welcome-outside' },
              'Alongside my cybersecurity work, I also enjoy building personal web projects, experimenting with design and exploring creative ideas.',
            ),
            h(
              'p',
              { class: 'welcome-flag' },
              mIcon('flag', 'welcome-flag-ico'),
              h(
                'span',
                null,
                'Take a look around, explore my work, and see if you can find all the hidden flags!',
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
