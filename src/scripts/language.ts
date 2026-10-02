/** Self-contained so the layout can run it inline before the parser reaches content. */
export function initializeLanguage(toEnglish: (source: string) => string) {
  type Language = 'zh-CN' | 'en';
  type Binding = { source: string; rendered: string };
  const textBindings = new WeakMap<Text, Binding>();
  const attributeBindings = new WeakMap<Element, Map<string, Binding>>();
  const attributes = ['aria-label', 'alt', 'title', 'placeholder', 'content'];
  let language: Language = 'en';
  try { if (localStorage.getItem('language') === 'zh-CN') language = 'zh-CN'; } catch { /* English remains the default. */ }

  function render(current: string, previous?: Binding, parserText = false): Binding {
    // A streamed HTML chunk can append to a text node we already translated.
    // Recover the original prefix instead of turning "About" + "我" into mixed copy.
    const source = previous && current === previous.rendered ? previous.source
      : previous && parserText && current.startsWith(previous.rendered) ? previous.source + current.slice(previous.rendered.length)
      : current;
    return {source, rendered: language === 'en' ? toEnglish(source) : source};
  }

  function translateTree(scope: Node) {
    if (scope instanceof HTMLButtonElement && scope.hasAttribute('data-language-toggle')) syncControl(scope);
    if (scope instanceof Element && scope.closest('script, style, [translate="no"]')) return;
    if (scope instanceof Text) {
      if (scope.parentElement?.closest('script, style, [translate="no"]')) return;
      const binding = render(scope.data, textBindings.get(scope), document.readyState === 'loading');
      textBindings.set(scope, binding);
      if (scope.data !== binding.rendered) scope.data = binding.rendered;
      return;
    }
    if (scope instanceof Element) {
      const bindings = attributeBindings.get(scope) || new Map<string, Binding>();
      for (const attribute of attributes) {
        const current = scope.getAttribute(attribute);
        if (current === null) continue;
        const binding = render(current, bindings.get(attribute));
        bindings.set(attribute, binding);
        if (current !== binding.rendered) scope.setAttribute(attribute, binding.rendered);
      }
      attributeBindings.set(scope, bindings);
    }
    scope.childNodes.forEach(translateTree);
  }

  function applyLanguage(next: Language) {
    language = next;
    document.documentElement.lang = language;
    translateTree(document.documentElement);
    document.dispatchEvent(new Event('site:languagechange'));
  }

  function syncControl(button: HTMLButtonElement) {
    const text = language === 'en' ? '中文' : 'EN';
    const label = language === 'en' ? 'Switch to Chinese' : '切换到英文';
    if (button.textContent !== text) button.textContent = text;
    button.lang = language === 'en' ? 'zh-CN' : 'en';
    if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
    button.hidden = false;
  }

  // Delegation also covers the control while the HTML parser is still inserting it.
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-language-toggle]')) return;
    const next = language === 'en' ? 'zh-CN' : 'en';
    try { localStorage.setItem('language', next); } catch { /* Switching still works on this page. */ }
    applyLanguage(next);
  });

  // Mutation callbacks run before rendering, including parser-inserted page content.
  // The same bindings preserve original copy when switching back or updating filters.
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(translateTree);
      else if (record.type === 'characterData') translateTree(record.target);
      else if (record.target instanceof Element) translateTree(record.target);
    }
  });
  observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes});
  applyLanguage(language);
}
