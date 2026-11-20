(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 720;
  const MAX_HEIGHT = 440;
  const MIN_HEIGHT = 170;
  const PAD = 46;
  const LABEL_SPACE = 20;
  const CHAR_WIDTH = 6.6;
  const GLYPH_HALF = 20;
  const LABEL_HEIGHT = 14;
  const EDGE = 6;
  const LABEL_SLOTS = [
    [33, 0],
    [33, 0.5],
    [33, -0.5],
    [-23, 0],
    [-23, 0.5],
    [-23, -0.5],
  ];

  function el(tag, attrs, ...kids) {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs || {})) node.setAttribute(key, value);
    kids.flat().forEach((kid) => kid && node.append(kid));
    return node;
  }

  const line = (d) => el('path', { class: 'tp-line', d });
  const body = (tag, attrs) => el(tag, { class: 'tp-shape', ...attrs });

  const GLYPHS = {
    router: () => [body('circle', { r: 17 }), line('M-9 0H9M0-9V9')],
    switch: () => [
      body('rect', { x: -19, y: -11, width: 38, height: 22, rx: 5 }),
      line('M-11-3H11M-11 4H11'),
    ],
    pc: () => [
      body('rect', { x: -14, y: -13, width: 28, height: 18, rx: 3 }),
      line('M0 5V12M-8 12H8'),
    ],
    server: () => [
      body('rect', { x: -11, y: -17, width: 22, height: 34, rx: 4 }),
      line('M-5-9H5M-5-2H5M-5 5H5'),
    ],
    cloud: () => [
      body('path', {
        d: 'M-16 8a8 8 0 0 1 2-15.5A10 10 0 0 1 6-10a8 8 0 0 1 10 8 6 6 0 0 1-2 12z',
        transform: 'translate(0 -2)',
      }),
    ],
    gateway: () => [
      body('rect', { x: -19, y: -4, width: 38, height: 16, rx: 5 }),
      line('M-9-4L-12-14M9-4L12-14'),
    ],
    modem: () => [
      body('rect', { x: -19, y: -9, width: 38, height: 18, rx: 5 }),
      line('M-9 0H-8M-2 0H-1M5 0H6'),
    ],
    iot: () => [
      body('rect', { x: -14, y: -14, width: 28, height: 28, rx: 8 }),
      body('circle', { r: 4 }),
    ],
    mcu: () => [
      body('rect', { x: -12, y: -12, width: 24, height: 24, rx: 3 }),
      line('M-17-6H-12M-17 6H-12M12-6H17M12 6H17'),
    ],
    tablet: () => [
      body('rect', { x: -11, y: -16, width: 22, height: 32, rx: 4 }),
      line('M-3 11H3'),
    ],
  };

  function layout(nodes) {
    const xs = nodes.map((node) => node.x);
    const ys = nodes.map((node) => node.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const spanX = Math.max(Math.max(...xs) - minX, 1);
    const spanY = Math.max(Math.max(...ys) - minY, 1);
    const scale = Math.min((WIDTH - 2 * PAD) / spanX, (MAX_HEIGHT - 2 * PAD - LABEL_SPACE) / spanY);
    const height = Math.max(MIN_HEIGHT, spanY * scale + 2 * PAD + LABEL_SPACE);
    const offsetX = (WIDTH - 2 * PAD - spanX * scale) / 2;
    const offsetY = (height - 2 * PAD - LABEL_SPACE - spanY * scale) / 2;
    const place = (node) => ({
      x: PAD + offsetX + (node.x - minX) * scale,
      y: PAD + offsetY + (node.y - minY) * scale,
    });
    return { height, place };
  }

  const overlaps = (a, b) =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

  function placeLabels(nodes, points) {
    const taken = nodes.map((node) => {
      const { x, y } = points.get(node.id);
      return { x: x - GLYPH_HALF, y: y - GLYPH_HALF, w: 2 * GLYPH_HALF, h: 2 * GLYPH_HALF };
    });
    return new Map(
      nodes.map((node) => {
        const { x, y } = points.get(node.id);
        const width = node.label.length * CHAR_WIDTH;
        const boxFor = ([dy, side]) => {
          const left = Math.min(Math.max(x + side * width - width / 2, EDGE), WIDTH - EDGE - width);
          return {
            dx: left + width / 2 - x,
            dy,
            box: { x: left, y: y + dy - 11, w: width, h: LABEL_HEIGHT },
          };
        };
        const slots = LABEL_SLOTS.map(boxFor);
        const slot =
          slots.find(({ box }) => !taken.some((other) => overlaps(other, box))) || slots[0];
        taken.push(slot.box);
        return [node.id, slot];
      }),
    );
  }

  function draw(topology) {
    const { height, place } = layout(topology.nodes);
    const points = new Map(topology.nodes.map((node) => [node.id, place(node)]));
    const links = topology.links.map((link) => {
      const from = points.get(link.a);
      const to = points.get(link.b);
      return el('line', { class: 'tp-link', x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    });
    const labels = placeLabels(topology.nodes, points);
    const nodes = topology.nodes.map((node) => {
      const { x, y } = points.get(node.id);
      return el(
        'g',
        {
          class: `tp-node tp-${node.kind}`,
          transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
        },
        GLYPHS[node.kind](),
        el(
          'text',
          { class: 'tp-label', x: labels.get(node.id).dx, y: labels.get(node.id).dy },
          node.label,
        ),
      );
    });
    return el(
      'svg',
      {
        class: 'tp',
        viewBox: `0 0 ${WIDTH} ${height.toFixed(0)}`,
        role: 'img',
        'aria-label': `Network topology diagram with ${topology.nodes.length} devices and ${topology.links.length} cables`,
      },
      links,
      nodes,
    );
  }

  window.Topology = { draw };
})();
