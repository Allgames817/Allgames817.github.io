import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { parse } from 'parse5';

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
const translations = JSON.parse(fs.readFileSync('src/data/translations.json', 'utf8'));
const translatorModule = { exports: {}, require: () => translations };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/translate.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, translatorModule);
let pages = 0;
for (const file of walk('dist').filter(file => file.endsWith('.html'))) {
  const page = parse(fs.readFileSync(file, 'utf8'));
  const head = page.childNodes.find(node => node.tagName === 'html').childNodes.find(node => node.tagName === 'head');
  const data = head.childNodes.find(node => node.tagName === 'script' && node.attrs.some(attr => attr.name === 'data-language-translations'));
  assert.ok(data, `Missing page dictionary: ${file}`);
  const dictionary = JSON.parse(data.childNodes.map(node => node.value || '').join(''));
  const pageTranslator = translatorModule.exports.createTranslator(dictionary);
  function inspect(node) {
    if (['script', 'style'].includes(node.tagName) || node.attrs?.some(attr => attr.name === 'translate' && attr.value === 'no')) return;
    if (node.nodeName === '#text') assert.equal(pageTranslator(node.value), translatorModule.exports.toEnglish(node.value), `Page dictionary misses text: ${file}: ${node.value}`);
    for (const attr of node.attrs || []) if (['aria-label', 'alt', 'title', 'placeholder', 'content'].includes(attr.name)) assert.equal(pageTranslator(attr.value), translatorModule.exports.toEnglish(attr.value), `Page dictionary misses label: ${file}: ${attr.value}`);
    for (const child of node.childNodes || []) inspect(child);
  }
  inspect(page);
  for (const source of ['打开导航菜单', '关闭导航菜单', '切换到浅色主题', '切换到深色主题', '星空动效：开', '星空动效：关', '星空动效：静态', '跟随系统 · 静态星空', '仅在暗色首页生效', '显示 1 个项目']) assert.equal(pageTranslator(source), translatorModule.exports.toEnglish(source), `Missing dynamic control copy: ${file}: ${source}`);
  const bootstrap = head.childNodes.find(node => node.tagName === 'script' && node.childNodes.some(child => child.value?.includes('function initializeLanguage')));
  assert.ok(bootstrap, `Missing parser-time language initialization: ${file}`);
  assert.ok(!bootstrap.attrs.some(attr => ['src', 'async', 'defer', 'type'].includes(attr.name)), `Language initializer must execute synchronously: ${file}`);
  new vm.Script(bootstrap.childNodes.map(node => node.value || '').join(''));
  pages++;
}

// Small DOM fixture tests streamed parsing, controls and dynamic copy without a browser.
class TextNode { constructor(data) { this.data = data; this.childNodes = []; } }
class ElementNode {
  constructor(tag = 'html', parent = null) { this.tag = tag; this.parentElement = parent; this.childNodes = []; this.attrs = new Map(); }
  closest(selector) {
    if (selector === '[data-language-toggle]') return this.hasAttribute('data-language-toggle') ? this : this.parentElement?.closest(selector);
    if (this.tag === 'script' || this.tag === 'style' || this.attrs.get('translate') === 'no') return this;
    return this.parentElement?.closest(selector);
  }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, value); }
  hasAttribute(name) { return this.attrs.has(name); }
  get textContent() { return this.childNodes.map(node => node.data ?? node.textContent).join(''); }
  set textContent(value) { const text = new TextNode(value); text.parentElement = this; this.childNodes = [text]; }
}
class ButtonNode extends ElementNode {}
const compiled = ts.transpileModule(fs.readFileSync('src/scripts/language.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
for (const stored of ['en', 'zh-CN', 'blocked']) {
  const root = new ElementNode();
  const listeners = new Map();
  const storage = new Map([['language', stored]]);
  let observer;
  const document = { documentElement: root, readyState: 'loading', addEventListener: (name, fn) => listeners.set(name, fn), dispatchEvent: () => {} };
  const scope = { exports: {}, document, Element: ElementNode, Text: TextNode, HTMLButtonElement: ButtonNode, Event: class {}, MutationObserver: class { constructor(fn) { observer = fn; } observe() {} }, localStorage: { getItem: key => { if (stored === 'blocked') throw Error('Storage blocked'); return storage.get(key); }, setItem: (key, value) => { if (stored === 'blocked') throw Error('Storage blocked'); storage.set(key, value); } } };
  vm.runInNewContext(compiled, scope);
  scope.exports.initializeLanguage(text => translations[text] || text);
  const paragraph = new ElementNode('p', root);
  paragraph.textContent = '关于';
  root.childNodes.push(paragraph);
  observer([{ type: 'childList', addedNodes: [paragraph] }]);
  assert.equal(paragraph.textContent, stored === 'zh-CN' ? '关于' : 'About');
  paragraph.childNodes[0].data += '我';
  observer([{ type: 'characterData', target: paragraph.childNodes[0] }]);
  assert.equal(paragraph.textContent, stored === 'zh-CN' ? '关于我' : 'About me', 'Streamed text must preserve the original prefix');
  const button = new ButtonNode('button', root);
  button.setAttribute('translate', 'no'); button.setAttribute('data-language-toggle', ''); button.hidden = true;
  root.childNodes.push(button);
  observer([{ type: 'childList', addedNodes: [button] }]);
  assert.equal(button.hidden, false);
  document.readyState = 'complete';
  listeners.get('click')({ target: button });
  assert.equal(paragraph.textContent, stored === 'zh-CN' ? 'About me' : '关于我');
  listeners.get('click')({ target: button });
  assert.equal(paragraph.textContent, stored === 'zh-CN' ? '关于我' : 'About me');
  assert.equal(root.lang, stored === 'zh-CN' ? 'zh-CN' : 'en');
}
console.log(`PASS: ${pages} pages initialize language in the head without a module fetch; streamed text, both toggle directions and blocked storage checked.`);
