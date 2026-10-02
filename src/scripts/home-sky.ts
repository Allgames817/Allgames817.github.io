const canvas = document.querySelector<HTMLCanvasElement>('[data-sky]');
const context = canvas?.getContext('2d');

if (canvas && context) {
  const sky = canvas, ctx = context;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const compact = matchMedia('(max-width: 768px)');
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  let enabled = document.documentElement.dataset.skyMotion !== 'off';
  let width = 0, height = 0, frame = 0, lastTime = 0, elapsed = 0, inView = true;
  let entranceStart = 0, wasDark = false;
  let pointerX = 0, pointerY = 0, offsetX = 0, offsetY = 0;
  let cursorX = -1000, cursorY = -1000, pointerActive = false;
  let meteors: {x: number; y: number; dx: number; dy: number; length: number; born: number}[] = [];
  let lastMeteor = -Infinity;
  let quietAreas: {left: number; right: number; top: number; bottom: number}[] = [];
  // Fixed seed prevents the star field from jumping when a theme or preference changes.
  const stars = Array.from({length: 96}, (_, index) => {
    const random = (salt: number) => { const n = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453; return n - Math.floor(n); };
    return {x: random(1), y: random(2), radius: .7 + random(3) * .8, depth: .35 + random(4) * .65, phase: random(5) * Math.PI * 2, speed: 2.2 + random(6) * 2};
  });
  const dark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : systemDark.matches;
  const moving = () => dark() && enabled && !reduced.matches && !document.hidden && inView;

  function clearance(x: number, y: number) {
    let opacity = 1;
    for (const area of quietAreas) {
      const dx = Math.max(area.left - x, 0, x - area.right);
      const dy = Math.max(area.top - y, 0, y - area.bottom);
      opacity = Math.min(opacity, Math.hypot(dx, dy) / 12);
    }
    return opacity;
  }

  function dot(x: number, y: number, radius: number, alpha: number) {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(205, 222, 249, ${alpha})`; ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!dark() || !width || !height) return;
    const count = compact.matches ? 30 : 96;
    for (const star of stars.slice(0, count)) {
      let x = ((star.x * width + Math.sin(elapsed * .12 + star.phase) * 18 + offsetX * star.depth) % width + width) % width;
      let y = ((star.y * height - elapsed * star.speed + offsetY * star.depth) % height + height) % height;
      const dx = x - cursorX, dy = y - cursorY, distance = Math.hypot(dx, dy);
      const influence = pointerActive && moving() ? Math.max(0, 1 - distance / 180) ** 2 : 0;
      if (distance > 0) { x += dx / distance * influence * 18; y += dy / distance * influence * 18; }
      // Fade at the actual text boundaries, leaving nearby empty sky interactive.
      // Near stars become visible first, then the finer stars fill in without flashing.
      const progress = Math.max(0, Math.min(1, (elapsed - entranceStart - (1 - star.depth) * .5) / 1.8));
      const reveal = moving() ? .18 + .82 * progress * progress * (3 - 2 * progress) : 1;
      const alpha = Math.min(.9, .42 + star.depth * .32 + Math.sin(elapsed * .65 + star.phase) * .06 + influence * .1) * clearance(x, y) * reveal;
      if (!alpha) continue;
      const radius = star.radius + influence * .2;
      dot(x, y, radius, alpha);
    }
    meteors = meteors.filter(meteor => elapsed - meteor.born < .65);
    for (const meteor of meteors) {
      const age = elapsed - meteor.born;
      const x = meteor.x + meteor.dx * age * 75, y = meteor.y + meteor.dy * age * 75;
      const tailX = x - meteor.dx * meteor.length, tailY = y - meteor.dy * meteor.length;
      // Omit any streak that would cross text, including the space between its endpoints.
      let space = 1;
      for (let sample = 0; sample <= 12; sample++) space = Math.min(space, clearance(tailX + (x - tailX) * sample / 12, tailY + (y - tailY) * sample / 12));
      const alpha = (1 - age / .65) ** 1.4 * .65 * space;
      if (alpha <= 0) continue;
      const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
      gradient.addColorStop(0, 'rgba(186, 212, 248, 0)');
      gradient.addColorStop(.65, `rgba(202, 222, 252, ${alpha * .45})`);
      gradient.addColorStop(1, `rgba(231, 241, 255, ${alpha})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(x, y);
      ctx.strokeStyle = gradient; ctx.lineWidth = .9; ctx.lineCap = 'round'; ctx.stroke();
    }
  }

  function tick(now: number) {
    if (!moving()) { frame = 0; return; }
    if (!lastTime || now - lastTime >= 1000 / 30) {
      elapsed += lastTime ? Math.min((now - lastTime) / 1000, .08) : 0;
      lastTime = now;
      offsetX += (pointerX - offsetX) * .09;
      offsetY += (pointerY - offsetY) * .09;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    const isDark = dark();
    if (isDark && !wasDark) entranceStart = elapsed;
    wasDark = isDark;
    sky.dataset.state = !isDark ? 'inactive' : reduced.matches || !enabled ? 'static' : document.hidden || !inView ? 'paused' : 'running';
    document.body.dataset.skyMotion = moving() ? 'on' : 'off';
    if (!moving()) { pointerX = pointerY = offsetX = offsetY = 0; pointerActive = false; meteors = []; lastMeteor = -Infinity; }
    // Avoid canvas work in background tabs. The next visibility change redraws it.
    if (!document.hidden && inView) draw();
    if (moving()) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const bounds = sky.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    sky.width = Math.round(width * dpr); sky.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    quietAreas = [...document.querySelectorAll('.site-header, .portrait, .hello-content > p, .hello-content > h1, .hello-links, .home-signoff, .sky-controls, .site-footer')].map(element => {
      const area = element.getBoundingClientRect();
      return {left: area.left - bounds.left - 6, right: area.right - bounds.left + 6, top: area.top - bounds.top - 6, bottom: area.bottom - bounds.top + 6};
    });
    if (!document.hidden && inView) draw();
  }

  document.addEventListener('site:skychange', () => {
    enabled = document.documentElement.dataset.skyMotion !== 'off';
    sync();
  });
  document.addEventListener('pointermove', event => {
    if (!moving() || (event.pointerType !== 'mouse' && !(event.pointerType === 'pen' && finePointer.matches))) return;
    const bounds = sky.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    const distance = pointerActive ? Math.hypot(x - cursorX, y - cursorY) : 0;
    if (distance > 6 && elapsed - lastMeteor >= .18) {
      meteors.push({x, y, dx: (x - cursorX) / distance, dy: (y - cursorY) / distance, length: Math.min(76, Math.max(38, distance * 1.5)), born: elapsed});
      meteors = meteors.slice(-3);
      lastMeteor = elapsed;
    }
    cursorX = x; cursorY = y; pointerActive = true;
    pointerX = compact.matches ? 0 : (event.clientX / innerWidth - .5) * 44;
    pointerY = compact.matches ? 0 : (event.clientY / innerHeight - .5) * 30;
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => { pointerX = pointerY = 0; pointerActive = false; meteors = []; });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('site:languagechange', resize);
  for (const query of [reduced, finePointer, compact, systemDark]) query.addEventListener('change', () => { pointerX = pointerY = 0; sync(); resize(); });
  new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  const observer = new ResizeObserver(resize);
  observer.observe(document.body);
  document.querySelectorAll('.hello-content, .home-end, .site-header').forEach(element => observer.observe(element));
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }).observe(sky);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  window.addEventListener('pageshow', sync);
  resize(); sync();
}
