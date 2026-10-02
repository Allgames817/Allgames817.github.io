import { toEnglish } from '../lib/translate';

const root = document.documentElement;
const tools = document.querySelector<HTMLElement>('[data-filter-tools]');
if (tools) {
  tools.hidden = false;
  const items = [...document.querySelectorAll<HTMLElement>('[data-item]')];
  const searchCorpus = new Map(items.map(item => [item, [item.dataset.search || '', ...[...item.querySelectorAll('h2,h3,p')].map(element => toEnglish(element.textContent || ''))].join(' ').toLocaleLowerCase()]));
  const buttons = [...tools.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const input = tools.querySelector<HTMLInputElement>('input');
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const count = tools.querySelector<HTMLElement>('[data-result-count]');
  const params = new URLSearchParams(location.search);
  let category = buttons.some(b => b.dataset.filter === params.get('category')) ? params.get('category')! : '全部';
  if (input) input.value = params.get('q') || '';
  function update() {
    const query = (input?.value || '').trim().toLocaleLowerCase();
    let found = 0;
    items.forEach(item => {
      const searchText = searchCorpus.get(item) || '';
      const visible = (category === '全部' || item.dataset.category === category) && (!query || searchText.includes(query));
      item.hidden = !visible;
      if (visible) found++;
    });
    document.querySelectorAll<HTMLElement>('[data-result-group]').forEach(group => { group.hidden = !group.querySelector('[data-item]:not([hidden])'); });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    if (empty) empty.hidden = found !== 0;
    if (count) {
      const message = `显示 ${found} ${input ? '篇文章' : '个项目'}`;
      count.textContent = root.lang === 'en' ? toEnglish(message) : message;
    }
    const state = new URL(location.href);
    category === '全部' ? state.searchParams.delete('category') : state.searchParams.set('category', category);
    query ? state.searchParams.set('q', input!.value.trim()) : state.searchParams.delete('q');
    history.replaceState(null, '', state);
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter!; update(); }));
  input?.addEventListener('input', update);
  document.addEventListener('site:languagechange', update);
  document.querySelector('[data-reset]')?.addEventListener('click', () => { category = '全部'; if (input) { input.value = ''; input.focus(); } update(); });
  update();
}
