import type { MarkdownInstance } from 'astro';
import features from '../data/features.json';
export interface PostData { title: string; description: string; category: string; slug: string; order: number; draft: boolean; projects: string[]; date?: string; }
const modules = import.meta.glob<MarkdownInstance<PostData>>('../content/blog/*.md', { eager: true });
export const posts = features.blog
  ? Object.values(modules).filter(post => !post.frontmatter.draft).sort((a, b) => a.frontmatter.order - b.frontmatter.order)
  : [];
