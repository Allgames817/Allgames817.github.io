---
name: 游志诚的个人网站
description: 个人工程手记，暮色玫瑰、系统字体与阅读优先的静态个人网站
colors:
  bg: "#faf8fa"
  surface: "#fffdfe"
  text: "#302d3e"
  muted: "#605769"
  accent: "#8b3e58"
  accent-soft: "#f2e7ed"
  line: "#ded8e2"
  diagram: "#efedf5"
  node: "#faf9fd"
  code-bg: "#24292e"
  code-text: "#e1e4e8"
  dark-bg: "#1c1c28"
  dark-surface: "#252533"
  dark-text: "#f0edf4"
  dark-muted: "#bbb5c8"
  dark-accent: "#e9a5bc"
  dark-accent-soft: "#382c3b"
  dark-line: "#423c50"
  dark-diagram: "#292938"
  dark-node: "#303040"
  sky-lavender: "#d9d1e6"
  sky-blush: "#edcfce"
  sky-peach: "#edc3b5"
  sky-rose: "#d4b6cc"
  sky-blue: "#a9c0e2"
  sky-mist: "#c9d8ed"
  mark-lavender: "#aa97c7"
  mark-rose: "#e0aab3"
  mark-blue: "#7199d2"
typography:
  monogram:
    fontFamily: "'Songti SC','STSong','SimSun',serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.8
  display:
    fontFamily: "'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    fontSize: "44px"
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: "0"
  headline:
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
  prose:
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.95
  label:
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.8
  button:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "'Cascadia Code','SFMono-Regular',Consolas,monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  tag: "4px"
  control: "6px"
  code: "8px"
  diagram: "12px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "64": "64px"
  "80": "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 19px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 19px"
  button-secondary-hover:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 19px"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    width: "100%"
  tag:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  filter-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  diagram:
    backgroundColor: "{colors.diagram}"
    rounded: "{rounded.diagram}"
---

# Design System: 游志诚的个人网站

## Overview

**Creative North Star: "个人工程手记"**

延续本次已确定的简洁、耐看、有个人感的方向，用暮色玫瑰、清楚的层次和适度科研与工程气质承载内容。保留用户参数 DESIGN_VARIANCE 5 / MOTION_INTENSITY 2 / VISUAL_DENSITY 4；参数表达设计取向，具体尺寸以当前实现为准。

本文件从 `src/styles/global.css` 与现有组件提取实际规则。采用 Astro 静态实现、原生 CSS 和少量浏览器 JavaScript；不引入外部字体或动画库。用户后续授权暗色首页采用可暂停的星空氛围动效，其他页面仍保持低动效。概念图负责解释主题，正文负责说明内容与证据边界。

**Key Characteristics:**

- 暮色玫瑰与完整浅深主题。
- 系统字体、中文优先、长文阅读清楚。
- 扁平表面、细分隔线与有限圆角。
- 代码绘制概念图，明确标注非实验截图。
- 低动效与键盘可见焦点。

## Colors

### 当前分区覆盖（2026-09-20 用户最新调整）

以下分区规则覆盖下方早期的全站玫瑰配色说明与 frontmatter 默认值。

- **亮色首页**：全页背景从顶部开始；0% #c5bddb、20% #d5c4d5、35% #e7c4ba、44% #e6b2ae 表达上半部维纳斯带；50% #c3a9cb、57% #8aabd5 过渡至地影；72% #709bd2、100% #6794d0 保持下半部蓝色，不再淡回白色。背景透明度为 1。正文 #172940，次级文字 #172b48，链接与姓名 #132b4a，分隔线 #8192b2。
- **暗色首页**：入夜天空渐变为 #111b31 / #242139 / #35273d / #253047 / #162d48 / #0d2038，分别位于 0 / 30 / 45 / 56 / 72 / 100%。正文 #edf2fa、次级文字 #bdcadd、强调色 #a8c8f4、边框 #425471。独立夜色层在主题切换时以 650ms 透明度交叉淡入淡出。
- **其他栏目亮色**：bg #f8f9fc、surface #fff、text #243247、muted #54647a、accent #254a78、accent-soft #e8eef6、line #d7dfea、diagram #edf1f7、node #fafcff。
- **其他栏目暗色**：bg #192331、surface #222f40、text #edf2f8、muted #b1c0d3、accent #9bbde8、accent-soft #2b405b、line #3c5068、diagram #223246、node #2b3d54。以暗蓝底色和较亮蓝色链接保证可读性。

亮色首页保留既有渐变；暗色首页加入稀疏星尘、背景视差与动效开关，具体边界见 Focus and motion。

玫瑰色强调配合雾紫背景和中性文字；首页使用参考图中的雾紫、粉橘与地平线蓝渐变；frontmatter 保留 CSS 实际颜色值，`dark-` 前缀表示同名变量的深色主题覆盖值。

### Primary

- **暮色玫瑰（accent）**：当前导航、正文链接、主按钮、焦点、流程连接线与强调节点。
- **淡玫瑰底色（accent-soft）**：筛选选中态、标签、行内代码与说明块。
- 深色主题使用对应的 `dark-accent` 与 `dark-accent-soft`。

### Neutral

- **雾紫页面（bg）与白色表面（surface）**：页面底色和控件表面。
- **深灰文字（text）与次级文字（muted）**：标题正文，以及摘要、元数据和图注。
- **细线灰（line）**：分隔线、输入边框、导航分界与图节点描边。
- **图底色（diagram）与节点底色（node）**：概念图层级；attention 图使用 surface。
- **代码背景与文字（code-bg / code-text）**：代码块固定配色，两个主题共用。

**The Theme Pairing Rule.** 普通界面颜色通过语义 CSS 变量整体切换；代码块保留专用配色，不额外制造装饰性反色区。首次遵循系统主题，手动选择记忆到 localStorage，并在 head 中提前应用。

## Typography

**Display / Body Font:** frontmatter 中的系统无衬线字体栈。  
**Label / Mono Font:** 普通标签继承正文，代码使用独立等宽字体栈。

字体不从外部网络加载；中文保持自然字距。粗细以常规正文与中等标题形成层次，辅助英文不抢占正文注意力。
首页已用用户指定的真实照片替换姓名字标；头像为 96px 圆形，手机为 84px，object-fit: cover、object-position: 50% 12%，保留完整面部。

### Hierarchy

- **Display**：首页标题为 44px / 1.5 / 450，姓名 600 字重；≤768px 为 32px，≤370px 为 28px。
- **Headline**：栏目页标题使用 headline；详情页标题为 40px。≤768px 时两者分别为 34px 与 30px。
- **Title**：通用二级标题使用 title；项目标题为 21px，移动端为 20px；文章二、三级标题分别为 25px、20px，移动端为 23px、19px。
- **Body**：全站使用 body；文章使用 prose，移动端降为 16px，保留 1.95 行高。正文最大宽度为 760px。
- **Label**：常用元数据为 13px；品牌辅助英文为 12px、字距 .035em；分类标签与示例徽标为 11px。
- **Code**：代码块使用 code；移动端为 12px。行内代码为正文的 .88em。

**The Readable Type Rule.** 保留正文行高和中文常规字距，不用超大字、负字距或外部装饰字体替代阅读层次。

## Layout

主容器最大宽 1160px，桌面宽度为视口减 64px；≤768px 时减 44px，≤370px 时减 32px。内容区底部留白桌面为 88px、移动端为 56px。间距令牌总结重复使用的节奏，局部真实尺寸如 14px、18px、22px、28px、36px 继续按组件使用。

首页为居中的单屏个人介绍：圆形本人头像 96px（手机 84px）、英文名、姓名、方向、学校与两个入口；正文宽度不超过 860px。主区最小高度为视口减去页眉页脚，矮屏允许自然滚动。精选项目移到项目页首个内容分组，其余项目在“更多探索”；各分组使用等宽双列，列距 36px、行距 48px，手机单列、间隔 34px。筛选同步隐藏空分组。最新文章集中在博客页。项目文字直接放在图片下方。

阅读区与关于页以最长 760px 的正文和右侧辅助栏组成，间隔 80px；≤1024px 缩为 40px，侧栏为 190px。≤768px 时正文单列，目录移至正文前方且取消 sticky；最窄断点下目录链接单列。代码与公式允许局部横向滚动。

页面采用 1024px、768px、370px 三个最大宽度断点；桌面头部高度在 ≥769px 明确为 78px。低动效保持布局稳定，内容不依赖入场动画显示。

## Elevation & Depth

全站不使用阴影。通过页面与表面色差、细边框、分隔线和留白表达层级。主按钮与选中状态依靠玫瑰色和淡玫瑰底色强调，不通过浮起、缩放或发光制造深度。

## Shapes

标签与行内代码为轻圆角（4px）；按钮、输入框、筛选与概念图节点为柔和小圆角（6px）；代码块和文字示意框为 8px；概念图外框与空状态为 12px。项目封面使用相同圆角并裁切内容。普通边框为 1px；当前导航底线为 2px；图节点描边为 1.4 SVG 单位，连接线为 1.5 SVG 单位。

## Components

### Buttons

克制、清楚的文字操作入口。链接式按钮桌面内边距使用 frontmatter 的按钮令牌，最小高度 46px；移动端内边距为 10px 16px、字体为 13px。原生按钮最小高度 44px，默认内边距 8px 14px。

主按钮使用强调底色与页面背景色文字，悬停保持同色并以 brightness(.94) 反馈。次按钮为表面底色，悬停使用淡玫瑰背景、强调文字与边框；quiet 按钮透明。原生按钮按下时使用淡玫瑰背景。

### Chips

分类标签仅表达真实分类，使用小圆角、淡玫瑰底色与次级文字。示例徽标采用透明背景和细线边框。筛选按钮最小高度 44px，未选中时透明，选中态为淡玫瑰底色、强调文字与 600 字重，并使用 aria-pressed 表达状态。

### Cards / Containers

项目以图与文字组成，不包额外带底色的整体卡片。图框承担边界，文字顶部留白为 20px，移动端为 16px。空状态使用 12px 圆角、虚线边框与明确说明，内边距为 64px 24px；缺少真实内容时保留诚实的空状态。

### Inputs / Fields

搜索框为表面底色、细线边框、6px 圆角与 48px 最小高度；桌面最大宽度 480px。标签位于输入上方，placeholder 为次级文字；光标采用强调色。无现有错误或禁用视觉变体，不虚构对应规范。

### Navigation

全站顶栏在浅色 / 深色按钮旁提供单个语言切换按钮，44px 高，与主题按钮保持相同边框和间距。中文模式显示 EN，英文模式显示中文，按钮文案表示点击后的目标语言，无障碍名称解释切换操作；360px 及以下时工具区独立成行，仍保持主题与语言相邻。切换保留焦点，不刷新当前页面；同步文档 lang、页面标题、无障碍标签和动态提示。英文正文行高 1.8；手机英文导航和 SVG 标签针对较长词语适配。品牌和关于页的双语姓名作为标识保留，首页问候语上方独立英文姓名行已移除。

五栏目导航当前项使用强调文字、600 字重和底线，避免仅靠颜色区分。桌面导航字体为 15px，移动端为 14px。移动端菜单由按钮展开；无 JavaScript 时导航仍可见。跳转正文链接在键盘聚焦时显示。宽屏文章目录贴在侧栏，移动端作为可折叠的正文前置区域。

### Concept diagrams

项目封面为原生 SVG 概念流程图，视窗为 560 × 204；三个节点沿水平轴排列，中间节点强调。每个图都有独立 HTML figcaption：“概念示意 · 非实验截图”，字体为 12px、行高 1.7，放在 SVG 外以保持窄屏清晰。SVG 的可访问名称包含主题、节点与“概念示意，非实验结果”。

桌面 SVG 标题为 15、节点名称为 16、英文辅助为 10 个 SVG 单位；≤768px 时标题与节点名称均为 22，节点文字向下移 9 个 SVG 单位，并隐藏英文辅助。图注使用 HTML 字体尺寸，不随 viewBox 缩小。

### Focus and motion

全局可见焦点为 3px 强调色外框、4px 偏移。操作入口保持相应的触控高度；桌面目录链接最小高度为 40px，移动端为 44px。普通链接悬停使用强调色和下划线，按钮与导航遵循各自的悬停规则。

按钮、链接与输入框使用 150ms 状态过渡。首页介绍区保持原位，在 800ms 内从 .9 透明度到 1，正文立即可读。亮色首页打开、返回或切回亮色时，整幅天空在 2400ms 内由浅淡逐渐显色（透明度 .16 → 1，与浅色底混合），背景尺寸恒定 100% × 100%，色带位置不变，不缩放、不拉伸，结束后静止。暗色首页开场：夜色图层始终不透明，1600ms 内亮度 1.3 → 1、饱和度 .65 → 1，营造暮色加深；星点延后 150ms，再用 2200ms 从透明到显现，同时按深度错开最多 325ms、用 1800ms 平滑提高各星点亮度，较亮星点先出现，随后接续现有星空漂移与鼠标流星。关闭星空动效时星点静态呈现；减少动态效果时跳过全部开场。主题切换仍保留原 650ms 图层过渡。

暗色首页单独加载原生 Canvas 星尘脚本：桌面最多 96 颗、手机最多 30 颗；标题、头像、正文、导航、页脚与控制区的实际边界周围 6px 内不绘制，外侧 12px 平滑淡出；不再屏蔽整块介绍区域。星点半径 .7–1.5px，每秒向上移动 2.2–4.2px，并有小幅横向漂移；亮度连续变化，不制造闪光。绘制上限约 30fps，像素比上限 2。桌面精确鼠标可产生水平最多 22px、垂直最多 15px 的视差，平滑跟随；窄屏不触发整体视差，触摸输入不触发鼠标效果。鼠标周围 180px 内星点会轻微散开并变亮，稳态星点亮度提高为约 .47–.8，保持细点与原有密度，不添加光晕；鼠标位移保持克制。鼠标尾迹改为连续细线流星：宽 .9px、长 38–76px，尾端透明、头部微亮，沿移动方向前行，650ms 内消失；最多同时 3 条，不再产生点状星尘，不改变系统指针。文字与页面布局始终稳定。

“星空动效：开 / 关”按钮位于全站每个页面右上角齿轮“显示设置”面板内，首页正文不再显示开关和鼠标提示；设置面板可点击外部或按 Escape 关闭，Escape 后焦点回到设置入口；浅色和其他栏目可提前保存偏好，提示“仅在暗色首页生效”；详情页与 404 同样保留入口。手机头部隐藏 GitHub 文字链接，为设置和菜单保留空间，页脚 GitHub 入口保留。按钮最小高度 44px，aria-pressed 表达开启状态，localStorage 仅记忆开关偏好。关闭时保留静态星点，取消动画帧。切换亮色、页面隐藏或离开视口时停止动画；返回时恢复。prefers-reduced-motion 时取消空间动效、CSS 入场与主题过渡，仅绘制静态星点并显示系统偏好说明。头像悬停仅在暗色、精确鼠标且动效开启时有轻微边缘高亮。

无滚动劫持、自定义鼠标或自动播放媒体。Canvas 无障碍隐藏且不接收指针，失败时不影响静态正文与导航。

## Do's and Don'ts

### 亮色栏目渐变与导航过渡（当前覆盖）

项目、博客、生活、关于及其详情页延续首页的维纳斯带到地影配色。首页保留原浓度；内页使用更浅的粉紫、粉桃与蓝色，项目蓝色终点 #b6cde8、博客 #cbdced、生活 #b9d1eb、关于 #bed2e9。背景固定在视口，长文滚动不改变文字位置；正文保持暗蓝，次要文字 #3d526d，边界 #a6b4ca。博客配色最浅，适合长文。

明暗两种主题的栏目切换都使用原生跨文档 View Transition，背景交融 450ms，正文先用 100ms 淡出、再用 200ms 淡入，避免两页长文叠在一起；亮色内页天空在进入时完成一次 650ms 的轻微舒展，随后静止。暗色内页延续首页同一深蓝—暮紫渐变（#111b31 → #242139 → #35273d → #253047 → #162d48 → #0d2038），进入时用 1600ms 完成暮色加深，正文与导航采用首页的浅蓝文字；星点与鼠标流星仅限首页。无持续循环、无新增依赖或路由拦截。不支持跨文档过渡时仍使用普通静态链接和单次背景入场；减少动态效果时禁用两者。

### Do:

- **Do** 保留用户确定的 5 / 2 / 4 参数、系统字体、暮色玫瑰、完整双主题与低动效。
- **Do** 使用语义颜色变量和当前实现的排版、圆角与布局尺寸。
- **Do** 保留可见键盘焦点、无 JavaScript 可读正文，以及明确的当前导航和筛选状态。
- **Do** 把概念图图注放在 SVG 外，并明确区分概念示意、示例草稿与实际成果。
- **Do** 保持 Astro 静态实现、内容与组件分离，以及诚实的空状态。

### Don't:

- **Don't** 添加商业营销模块、无内容意义的装饰模块、不可暂停的持续动画或入场隐藏。持续动效仅限用户授权的暗色首页星空。
- **Don't** 引入外部字体、React 或动画库来替换已确定的静态实现。
- **Don't** 把概念流程图当作实验结果或实物截图，或为缺失内容虚构视觉证据。
- **Don't** 用未经确认的字体、主题、色彩或内容偏好覆盖本次采用的规则。



### 首页探索方向文案（当前覆盖）
原关注领域标签行替换为完整的中英文探索句，上方主介绍更新为“在代码、书页与生活之间，保持好奇，持续创造。”。中文与英文分别只显示对应语种，静态 HTML 默认中文，无 JavaScript 仍可读。
中文标注完整短语“感知世界 / 理解世界 / 在其中行动”，英文标注“perceives / understands / acts”。文字始终可见，保持原字号与 600 字重；移除下划线，用主题强调色 10% 透明度的窄圆角底色轻托短语，悬停时增至 18%。底色以 160ms 间隔依次淡入，每项 600ms，总时长约 1.22 秒，之后静止。没有描边、发光、模糊或位移动画，避免与链接样式混淆。亮色暗蓝底、暗色雾蓝底，减少动态效果时直接呈现。正文 14px，手机 13px，行高 2；完整短语和英文标点保持在同一行，整句自然换行。

### 主介绍：清晰静态排版（覆盖原对焦显影）
保留用户指定的完整中英文主句。沿用项目系统无衬线字体，姓名标题 44px，主介绍桌面 30px、手机 22px（370px 以下 20px），副文本 14px / 13px。主介绍行高 1.65 / 手机 1.75，与副文本间距 32px / 手机 28px；中文桌面一行、手机两行，英文按破折号分为两句，窄屏允许自然换行。
按用户反馈移除主介绍的对焦显影与文字入场动画。整句从首次显示起即清晰、不透明，末尾“持续创造 / always creating”保留单一主题强调色和 600 字重。保留已确定的字号、分句换行与间距。背景渐变、暗色星空，以及下方研究方向的轻底色标注保持既有实现。
Impeccable detect 启动问题已解决：将 IMPECCABLE_HOME 指向已有项目缓存 .impeccable/runtime 后，engine 0.1.5 可正常运行。使用 npm run design:check 检测字体规则；建议仍需结合实际排版核对。

### 英文 curious / creating 艺术强调
仅英文主句的 curious 和 creating 使用同字体的 600 字重斜体，always 恢复普通字重和正文色。强调色更新为浅色深鸢尾紫 #40325f / 暗色香槟金 #e7ce9c。参考 Taste 的 SVG 线条绘制，用一段低透明度开放弧线轻绕 curious；creating 右上方为不超过 10px 的小星芒。弧线绘制一次，星芒轻微旋入一次，总序列 1.3 秒；悬停时弧线轻转 4 度，星芒转 90 度。文字始终清晰，不移动、不虚焦；无循环和新增依赖。SVG 绝对定位不占行宽，aria-hidden 隐藏装饰，保留斜体下伸笔画空间。减少动态效果时静态呈现。中文亦对应强调“好奇 / 创造”，具体适配见下。

### 中文“好奇 / 创造”艺术强调
中文与英文共享主题艺术强调色、一次性细弧绘制和小星芒。中文保持正体，不合成斜体；只强调“好奇”和“创造”，“保持”“持续”恢复普通字重和正文色。根据双字中文的字面高度调整弧线范围和星芒位置，行高 1.5、上下留白 .04em，不改变整句字号、基线或原文。保留减少动态效果回退。

### 艺术关键词配色（当前覆盖）
只改变 curious / creating 与好奇 / 创造的文字、弧线和星芒色，保留全部已确认的字形、动效、透明度与布局。浅色深鸢尾紫 #40325f 与暮色粉紫背景同色系，暗色香槟金 #e7ce9c 与夜空形成温和冷暖对比。深浅模式分别设置 --art-ink，系统深色且无 JavaScript 时同样使用暗色值。

### 邮件联系入口
首页“更多关于我 / GitHub”后增加“邮件联系”，英文显示 Email；全站页脚在 GitHub 旁增加 Email，均使用 profile.email 的 mailto 链接。只在关于页直接显示完整地址。入口沿用文字链接、主题色和至少 44px 触控高度；首页窄屏缩小链接间距，极窄宽度允许换行，页脚链接保持成组。

### 默认语言
首次访问或没有已保存选择时默认英文，语言按钮显示“中文”；点击后显示中文页面，按钮变为 EN。沿用已保存的主动语言选择，刷新与跨页访问保持一致。head 中提前设置 lang，使首页双语文本和排版尽早选择正确版本；静态源码仍保留完整中文内容作为禁用脚本的可读回退。

### 默认明暗主题
未保存手动主题时，首次渲染即读取访问者系统的 prefers-color-scheme；页面打开期间系统主题改变也会同步。手动选择浅色或深色后记住偏好，不再由系统覆盖。与默认英文独立，语言切换不改变主题。

### 邮箱直接展示（当前覆盖）
首页与全站页脚的邮件入口直接显示 124090817@link.cuhk.edu.cn，中英文一致，保留 mailto 点击行为；页脚链接组允许窄屏换行。

### 工具作品与项目排序
项目页只保留「精选项目」与「更多探索」；精选展示 ACT 与转学分查询，其余按 date 从新到旧排列。「工具与作品」仅保留为筛选按钮。沿用桌面双列、手机单列的项目网格，真实界面截图在卡片中从顶部裁切，与概念封面高度接近；详情保留完整截图。工具卡片提供打开网站、项目介绍、GitHub 三个入口，截图仅标注「线上查询界面」，不显示采集日期。详情共用阅读布局与目录，工具章节使用功能与体验、实现方式、使用与代码、使用范围；没有关联文章时省去空章节。沿用系统字体、渐变背景、主题与中英文切换。
