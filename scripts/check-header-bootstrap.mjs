import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { parse } from 'parse5';

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(`${dir}/${entry.name}`):[`${dir}/${entry.name}`]);
let pages=0;
for(const file of walk('dist').filter(file=>file.endsWith('.html'))){
  const body=parse(fs.readFileSync(file,'utf8')).childNodes.find(node=>node.tagName==='html').childNodes.find(node=>node.tagName==='body');
  const index=body.childNodes.findIndex(node=>node.tagName==='script'&&node.attrs.some(attr=>attr.name==='data-header-controls'));
  assert.ok(index>body.childNodes.findIndex(node=>node.tagName==='header'),`Header initializer must follow parsed controls: ${file}`);
  assert.ok(index<body.childNodes.findIndex(node=>node.tagName==='main'),`Header must be ready before content: ${file}`);
  const script=body.childNodes[index];
  assert.ok(!script.attrs.some(attr=>['src','async','defer','type'].includes(attr.name)),`Header must not wait for modules: ${file}`);
  new vm.Script(script.childNodes.map(node=>node.value||'').join(''));
  pages++;
}

const compiled=ts.transpileModule(fs.readFileSync('src/scripts/header.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function fixture({storedTheme=null,storedSky=null,blocked=false,reduced=false,home=false}={}){
  class Node {
    attrs=new Map(); listeners=new Map(); hidden=true; open=false;
    setAttribute(key,value){this.attrs.set(key,value)}
    getAttribute(key){return this.attrs.get(key)??null}
    addEventListener(name,fn){this.listeners.set(name,[...(this.listeners.get(name)||[]),fn])}
    dispatch(name,event={}){this.listeners.get(name)?.forEach(fn=>fn(event))}
    focus(){this.focused=true}
    contains(node){return node===this||node===summary||node===skyButton}
  }
  const themeButton=new Node(),label=new Node(),settings=new Node(),summary=new Node(),skyButton=new Node(),panel=new Node(),note=new Node(),menu=new Node();
  menu.setAttribute('aria-expanded','false');
  themeButton.querySelector=()=>label;
  settings.querySelector=selector=>({'[data-sky-toggle]':skyButton,'[data-sky-controls]':panel,'[data-sky-note]':note,summary}[selector]);
  const classes=new Set();
  const header={classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),toggle:(name,on)=>on?classes.add(name):classes.delete(name)}};
  const root={dataset:{theme:storedTheme==='light'?'light':'dark'}};
  const document=new Node(); document.documentElement=root;
  document.querySelector=selector=>({'.theme-toggle':themeButton,'[data-display-settings]':settings,'[data-sky]':home?{}:null,'.menu-toggle':menu,'.site-header':header}[selector]);
  document.dispatchEvent=event=>document.dispatch(event.type);
  const queries=new Map();
  const storage=new Map([['theme',storedTheme],['sky-motion',storedSky]]);
  const scope={exports:{},document,Node,Event:class{constructor(type){this.type=type}},localStorage:{getItem:key=>{if(blocked)throw Error('Blocked');return storage.get(key)},setItem:(key,value)=>{if(blocked)throw Error('Blocked');storage.set(key,value)}},matchMedia:query=>{if(!queries.has(query)){const media=new Node();media.matches=query.includes('reduced-motion')?reduced:true;queries.set(query,media)}return queries.get(query)}};
  vm.runInNewContext(compiled,scope);scope.exports.initializeHeader();
  return {root,document,themeButton,label,settings,summary,skyButton,panel,note,menu,classes,storage,queries};
}
for(const blocked of [false,true]){
  const page=fixture({blocked,home:true});
  assert.equal(page.themeButton.hidden,false);assert.equal(page.settings.hidden,false);assert.equal(page.menu.hidden,false);
  assert.equal(page.label.textContent,'浅色');assert.equal(page.panel.hidden,false);assert.equal(page.note.hidden,true);
  page.themeButton.dispatch('click');assert.equal(page.root.dataset.theme,'light');assert.equal(page.label.textContent,'深色');assert.equal(page.note.hidden,false);
  let preferenceEvents=0;page.document.addEventListener('site:skychange',()=>preferenceEvents++);
  page.skyButton.dispatch('click');assert.equal(page.root.dataset.skyMotion,'off');assert.equal(page.skyButton.getAttribute('aria-pressed'),'false');assert.equal(preferenceEvents,1);
  page.menu.dispatch('click');assert.equal(page.menu.getAttribute('aria-expanded'),'true');assert.ok(page.classes.has('menu-open'));
  page.document.dispatch('keydown',{key:'Escape'});assert.equal(page.menu.getAttribute('aria-expanded'),'false');assert.ok(page.menu.focused);
  page.settings.open=true;page.document.dispatch('keydown',{key:'Escape'});assert.equal(page.settings.open,false);assert.ok(page.summary.focused);
  page.settings.open=true;page.document.dispatch('click',{target:page.themeButton});assert.equal(page.settings.open,false);
  const media=page.queries.get('(prefers-color-scheme: dark)');media.dispatch('change',{matches:true});assert.equal(page.root.dataset.theme,'light','Manual theme choice takes precedence');
}
const saved=fixture({storedTheme:'light',storedSky:'off'});assert.equal(saved.root.dataset.skyMotion,'off');assert.equal(saved.skyButton.textContent,'星空动效：关');
const still=fixture({reduced:true});assert.equal(still.skyButton.disabled,true);assert.equal(still.skyButton.getAttribute('aria-pressed'),'false');assert.equal(still.skyButton.textContent,'星空动效：静态');
const system=fixture();system.queries.get('(prefers-color-scheme: dark)').dispatch('change',{matches:false});assert.equal(system.root.dataset.theme,'light');
console.log(`PASS: ${pages} pages initialize header controls synchronously; interactions, saved preferences, blocked storage, reduced motion, keyboard dismissal and system theme checked.`);
