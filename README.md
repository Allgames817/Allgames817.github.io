# 游志诚的个人网站

使用 Astro 构建的静态个人网站，包含首页、项目、生活和关于四个公开栏目。默认英文，支持中文切换、明暗主题和可关闭的星空背景。正文、图片和译文均随网站发布，无需在线翻译服务。

站点地址：[allgames817.github.io](https://allgames817.github.io/)。

## 本地运行

需要 Node.js 24 和 npm。

```powershell
npm ci
npm run dev
```

开发服务器地址以终端输出为准。构建和检查：

```powershell
npm run check
npm run build
npm run test:static
npm run test:language
npm run test:language-bootstrap
npm run test:header-bootstrap
npm run preview
```

构建输出为 `dist/`，所有详情页输出为 `<route>/index.html`。无需配置单页应用的路由回退。

## 内容维护

| 路径 | 用途 |
| --- | --- |
| `src/data/site.ts` | 个人简介、导航、联系方式和路径辅助函数 |
| `src/data/projects.json` | 项目内容及公开链接 |
| `src/data/life.json` | 书架、音乐和完整交流随记 |
| `src/data/features.json` | 博客展示开关 |
| `src/content/blog/*.md` | 保留的文章草稿 |
| `src/data/translations.json` | 本地英文译文 |
| `src/layouts/Layout.astro` | 共用布局与页面元信息 |
| `src/styles/global.css` | 主题、排版和交互状态 |
| `public/` | 公开图片、证书和图标 |
| `DESIGN.md` | 视觉规范 |

目前博客开关为 `false`，导航、关联文章入口和博客页面均不发布。准备公开首篇文章时，将 `blog` 改为 `true`，并把该文章的 `draft` 改为 `false` 后重新构建。`draft: true` 的文章始终不进入公开页面。

新增或修改中文内容后，同步维护英文译文并运行语言检查。项目成果、阅读日期和交流内容应使用可核实的真实资料。

项目可用 `hiddenSections` 暂时隐藏 `method`、`results`、`next`、`links` 区块，目录同步收起，原始内容仍保留在数据中。

## GitHub Pages

默认使用 `site=https://allgames817.github.io` 和 `base=/`。在仓库 Settings → Pages 中将 Source 设为 GitHub Actions，然后在 Actions 中手动运行 **Deploy static site to GitHub Pages**。

工作流使用 Node.js 24，先检查和构建，再上传 `dist/` 并部署。推送源码不会自动触发发布；更新后需手动运行工作流。

若改用项目仓库路径，需同步修改 `astro.config.mjs` 或工作流中的 `SITE_URL`、`BASE_PATH`。部署方式参考 [Astro 官方文档](https://docs.astro.build/en/guides/deploy/github/)。

## 公开素材

网站仅引用准备公开的图片、项目资料和证书副本。证书的学号已从公开 PDF 中移除。原始附件、本地审核记录、运行缓存和环境变量不进入仓库或发布目录；本地临时输入应放入被 Git 忽略的 `private-input/`。
