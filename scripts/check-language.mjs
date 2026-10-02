import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {parse} from 'parse5';

const translations = JSON.parse(fs.readFileSync('src/data/translations.json', 'utf8'));
const compiled = ts.transpileModule(fs.readFileSync('src/lib/translate.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const scope = {exports:{}, require:()=>translations};
vm.runInNewContext(compiled, scope);
const {toEnglish} = scope.exports;
const walk = directory => fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);
const missing = new Set();
let pages = 0;
function check(text) {
  if (/\p{Script=Han}/u.test(text) && /\p{Script=Han}/u.test(toEnglish(text))) missing.add(text.trim());
}
function inspect(node) {
  if (['script','style'].includes(node.tagName) || node.attrs?.some(a=>a.name==='translate'&&a.value==='no')) return;
  if (node.nodeName === '#text') check(node.value);
  for (const attr of node.attrs || []) if (['aria-label','alt','title','placeholder','content'].includes(attr.name)) check(attr.value);
  for (const child of node.childNodes || []) inspect(child);
}
for (const file of walk('dist').filter(file=>file.endsWith('.html'))) {
  const html = fs.readFileSync(file,'utf8');
  assert.match(html,/data-language-toggle/,'Language control missing: '+file);
  inspect(parse(html));
  pages++;
}
assert.deepEqual([...missing], [], 'Untranslated authored copy');
assert.equal(toEnglish('显示 1 篇文章'),'Showing 1 post');
assert.equal(toEnglish('显示 0 个项目'),'Showing 0 projects');
assert.equal(toEnglish('首页 · 游志诚'),'Home · Zhicheng You');
assert.equal(toEnglish('New, unreviewed content'),'New, unreviewed content');
console.log(`PASS: all authored text and accessible labels across ${pages} pages have English translations; dynamic counts, titles and fallback checked.`);
