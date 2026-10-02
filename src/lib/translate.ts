import translations from '../data/translations.json';

/** Translate authored copy only. Unknown content stays intact for editorial review. */
export function createTranslator(english: Record<string, string>) {
  return function toEnglish(source: string): string {
    const text = source.trim();
    let translated = english[text];
    if (translated === undefined && text.endsWith(' · 游志诚')) {
      translated = `${toEnglish(text.slice(0, -6))} · Zhicheng You`;
    }
    if (translated === undefined && /^© \d{4} 游志诚$/.test(text)) translated = text.replace('游志诚', 'Zhicheng You');
    if (translated === undefined && /^(查看|阅读).+/.test(text)) {
      translated = `${text.startsWith('查看') ? 'View' : 'Read'} ${toEnglish(text.slice(2))}`;
    }
    if (translated === undefined && text.includes(' / ')) translated = text.split(' / ').map(toEnglish).join(' / ');
    if (translated === undefined && text.endsWith('。概念示意，非实验结果。')) {
      const [title, nodes] = text.slice(0, -12).split('：');
      if (nodes) translated = `${toEnglish(title)}: ${nodes.split('、').map(toEnglish).join(', ')}. Concept diagram, not experimental results.`;
    }
    const count = text.match(/^显示 (\d+) (篇文章|个项目)$/);
    if (count) translated = `Showing ${count[1]} ${count[2] === '篇文章' ? Number(count[1]) === 1 ? 'post' : 'posts' : Number(count[1]) === 1 ? 'project' : 'projects'}`;
    if (translated === undefined) return source;
    return source.slice(0, source.length - source.trimStart().length) + translated + source.slice(source.trimEnd().length);
  };
}

export const toEnglish = createTranslator(translations);
