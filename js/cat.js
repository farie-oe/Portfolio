(function () {
  const btn = document.getElementById('cat-btn');
  const bubble = document.getElementById('cat-bubble');
  if (!btn || !bubble) return;
  let timer = 0;

  function say(text, ms = 4200) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  btn.addEventListener('click', () => {
    bubble.classList.remove('show');
    Welcome.open();
  });

  Bus.on('boot', () =>
    setTimeout(() => say('Hi! I am the lab cat. Have a look around.', 5000), 1500),
  );
  Bus.on('open:certs', () => say('Mafaro is ISC2 Certified in Cybersecurity.'));
  Bus.on('flags:found', () => say(['Found one!', 'Sharp eyes.', 'Nice catch.'][Flags.count() % 3]));
  Bus.on('flags:complete', () => say('You found them all! Look up at the sky.', 6000));
})();
