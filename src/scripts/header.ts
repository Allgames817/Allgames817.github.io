/** Runs synchronously once the header markup has been parsed, without a module fetch. */
export function initializeHeader() {
  const root = document.documentElement;
  const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
  const themeLabel = themeButton?.querySelector('[data-theme-label]');
  const media = matchMedia('(prefers-color-scheme: dark)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let manual = false;
  let skyEnabled = true;
  try {
    manual = ['dark', 'light'].includes(localStorage.getItem('theme') || '');
    skyEnabled = localStorage.getItem('sky-motion') !== 'off';
  } catch { /* Preferences still work for this visit when storage is blocked. */ }

  const settings = document.querySelector<HTMLDetailsElement>('[data-display-settings]');
  const skyButton = settings?.querySelector<HTMLButtonElement>('[data-sky-toggle]');
  const skyPanel = settings?.querySelector<HTMLElement>('[data-sky-controls]');
  const skyNote = settings?.querySelector<HTMLElement>('[data-sky-note]');
  const home = Boolean(document.querySelector('[data-sky]'));

  function syncSkyPreference() {
    root.dataset.skyMotion = skyEnabled ? 'on' : 'off';
    if (skyButton && skyPanel && skyNote) {
      skyButton.disabled = reduced.matches;
      skyButton.setAttribute('aria-pressed', String(skyEnabled && !reduced.matches));
      skyButton.textContent = reduced.matches ? '星空动效：静态' : `星空动效：${skyEnabled ? '开' : '关'}`;
      skyNote.textContent = reduced.matches ? '跟随系统 · 静态星空' : '仅在暗色首页生效';
      skyNote.hidden = !reduced.matches && home && root.dataset.theme === 'dark';
      skyPanel.hidden = false;
    }
  }

  function syncThemeLabel() {
    const next = root.dataset.theme === 'dark' ? '浅色' : '深色';
    themeButton?.setAttribute('aria-label', `切换到${next}主题`);
    if (themeLabel) themeLabel.textContent = next;
    syncSkyPreference();
  }

  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    manual = true;
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* Optional storage. */ }
    syncThemeLabel();
  });
  media.addEventListener('change', event => {
    if (!manual) {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      syncThemeLabel();
    }
  });
  skyButton?.addEventListener('click', () => {
    skyEnabled = !skyEnabled;
    try { localStorage.setItem('sky-motion', skyEnabled ? 'on' : 'off'); } catch { /* Optional storage. */ }
    syncSkyPreference();
    document.dispatchEvent(new Event('site:skychange'));
  });
  reduced.addEventListener('change', syncSkyPreference);

  const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const header = document.querySelector('.site-header');
  function closeMenu() {
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', '打开导航菜单');
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    header?.classList.toggle('menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  });
  matchMedia('(min-width: 769px)').addEventListener('change', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (settings?.open) { settings.open = false; settings.querySelector('summary')?.focus(); }
    if (menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (settings && event.target instanceof Node && !settings.contains(event.target)) settings.open = false;
  });

  // Assign the correct labels and handlers before revealing controls in the first layout.
  syncThemeLabel();
  if (themeButton) themeButton.hidden = false;
  if (settings) settings.hidden = false;
  if (menuButton) { header?.classList.add('menu-ready'); menuButton.hidden = false; }
}
