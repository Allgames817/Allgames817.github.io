import features from './features.json';

export const profile = {
  name: '游志诚',
  englishName: 'Zhicheng You',
  school: '香港中文大学（深圳）',
  role: '计算机工程本科生',
  intro: '我是一名计算机工程本科生，关注机器人学习与具身智能。这里记录我的项目、技术探索，以及学习之外的生活。',
  github: 'https://github.com/Allgames817',
  email: '124090817@link.cuhk.edu.cn',
  interests: ['具身智能', '机器人学习', '世界模型'],
  practice: ['机器人视觉', 'AI 系统', '嵌入式开发'],
  now: '已完成 ACT 的学习与复现。接下来，希望进一步理解 Diffusion Policy，整理机器人学习的思路与问题。',
};
export const navigation = [
  { label: '首页', path: '/' }, { label: '项目', path: '/projects/' },
  { label: '博客', path: '/blog/' }, { label: '生活', path: '/life/' },
  { label: '关于', path: '/about/' },
].filter(item => features.blog || item.path !== '/blog/');
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
