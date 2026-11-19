(function () {
  const scene = document.getElementById('scene');
  if (!scene) return;

  const STAR_COUNT = 150;
  const CLOUDS = [
    { top: 14, width: 460, opacity: 0.16, duration: 190, delay: -40 },
    { top: 30, width: 340, opacity: 0.12, duration: 150, delay: -110 },
    { top: 46, width: 520, opacity: 0.14, duration: 230, delay: -170 },
    { top: 58, width: 320, opacity: 0.17, duration: 170, delay: -20, hidesFlag: true },
    { top: 70, width: 420, opacity: 0.16, duration: 260, delay: -90 },
  ];
  const CAT_OUTLINE = [
    [30, 14, 3.4],
    [58, 52, 2.4],
    [100, 42, 2],
    [142, 52, 2.6],
    [170, 14, 3.6],
    [183, 94, 2.4],
    [152, 140, 3],
    [100, 154, 2.2],
    [48, 140, 2.8],
    [17, 94, 3],
  ];
  const CAT_FACE = [
    [70, 86, 5],
    [130, 86, 5.4],
    [100, 108, 2.6],
    [84, 126, 2.2],
    [116, 126, 2.4],
  ];
  const EYE_MIN_RADIUS = 4;

  let seed = 11;
  function seededRandom() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }

  function addStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = 1 + seededRandom() * 2;
      const left = seededRandom() * 100;
      const top = seededRandom() * 62;
      const opacity = 0.25 + seededRandom() * 0.5;
      const twinkle = 3 + seededRandom() * 5;
      const delay = seededRandom() * 8;
      scene.append(
        h('i', {
          class: 'star',
          style: `left:${left.toFixed(1)}%;top:${top.toFixed(1)}%;--r:${radius.toFixed(1)}px;--o:${opacity.toFixed(2)};--d:${twinkle.toFixed(1)}s;--delay:-${delay.toFixed(1)}s`,
        }),
      );
    }
  }

  function addFlagStar() {
    const star = h('i', {
      class: 'star special',
      role: 'button',
      tabindex: '0',
      'aria-label': 'A twinkling star',
      style: 'left:81%;top:13%;--r:5px;--o:.9;--d:2.2s;--delay:0s',
    });
    scene.append(star);
    star.addEventListener('click', () => findFlag(star, 'star'));
    star.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') findFlag(star, 'star');
    });
  }

  function addClouds() {
    CLOUDS.forEach((cloud) => {
      const el = h('div', {
        class: 'cloud' + (cloud.hidesFlag ? ' special' : ''),
        style: `top:${cloud.top}%;--w:${cloud.width}px;--o:${cloud.opacity};--t:${cloud.duration}s;--delay:${cloud.delay}s`,
      });
      scene.append(el);
      if (cloud.hidesFlag) el.addEventListener('click', () => findFlag(el, 'cloud'));
    });
  }

  function findFlag(el, flagId) {
    Flags.reveal(flagId);
    el.classList.remove('found-pop');
    void el.offsetWidth;
    el.classList.add('found-pop');
  }

  const linePath = (points, closed = false) =>
    points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + (closed ? ' Z' : '');

  function constellationMarkup() {
    const stars = [
      ...CAT_OUTLINE.map((star) => [...star, 'edge']),
      ...CAT_FACE.map((star) => [...star, star[2] > EYE_MIN_RADIUS ? 'eye' : 'face']),
    ];
    const dots = stars
      .map(
        ([x, y, radius, kind], i) =>
          `<circle class="${kind}" cx="${x}" cy="${y}" r="${radius}" style="--i:${i}"/>`,
      )
      .join('');
    const [leftMouth, nose, rightMouth] = [CAT_FACE[3], CAT_FACE[2], CAT_FACE[4]];
    const outline = linePath(CAT_OUTLINE, true);
    const mouth = linePath([leftMouth, nose, rightMouth]);
    return `<svg class="constellation" viewBox="0 0 200 170" aria-hidden="true"><path d="${outline}"/><path class="mouth" d="${mouth}"/>${dots}</svg>`;
  }

  function showConstellation() {
    if (scene.querySelector('.constellation')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = constellationMarkup();
    scene.append(wrapper.firstChild);
  }

  addStars();
  addFlagStar();
  addClouds();
  Bus.on('boot', () => {
    if (Flags.remaining() === 0) showConstellation();
  });
  Bus.on('flags:complete', showConstellation);
})();
