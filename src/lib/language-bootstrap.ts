import translations from '../data/translations.json';
import { createTranslator } from './translate';
import { initializeLanguage } from '../scripts/language';
import { parseFragment } from 'parse5';

type HtmlNode = { nodeName: string; tagName?: string; value?: string; attrs?: { name: string; value: string }[]; childNodes?: HtmlNode[] };
const sharedCopy = [
  '跳到正文', '主导航', 'GitHub（新窗口）', '菜单', '打开导航菜单', '关闭导航菜单',
  '切换明暗主题', '切换到浅色主题', '切换到深色主题', '浅色', '深色', '显示设置', '暗色首页',
  '星空动效：开', '星空动效：关', '星空动效：静态', '跟随系统 · 静态星空', '仅在暗色首页生效',
  '控制暗色首页的星空与鼠标流星效果，偏好在全站保存。',
];

/** Include page and shared-control copy, without downloading unrelated articles on every route. */
export function pageTranslations(content: string, shellCopy: string[]) {
  const copy = [...sharedCopy, ...shellCopy];
  function collect(node: HtmlNode) {
    if (['script', 'style'].includes(node.tagName || '') || node.attrs?.some(attr => attr.name === 'translate' && attr.value === 'no')) return;
    if (node.value) copy.push(node.value);
    for (const attr of node.attrs || []) if (['aria-label', 'alt', 'title', 'placeholder', 'content'].includes(attr.name)) copy.push(attr.value);
    for (const child of node.childNodes || []) collect(child);
  }
  collect(parseFragment(content));
  const selected = Object.fromEntries(Object.entries(translations).filter(([source]) => copy.some(text => text.includes(source))));
  return JSON.stringify(selected).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

// Build-time serialization keeps one runtime implementation and needs no script fetch.
export const languageBootstrap = `(${initializeLanguage.toString()})((${createTranslator.toString()})(JSON.parse(document.querySelector('[data-language-translations]').textContent)));`;
