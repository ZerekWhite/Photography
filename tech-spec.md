# 技术规范文档

## 项目概述

摄影作品集网站 - 极简主义深色主题设计

## 技术栈

- **框架**: React + TypeScript + Vite
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **动画库**: GSAP + ScrollTrigger
- **图标**: Lucide React

## 组件清单

### shadcn/ui 组件
- Button - 按钮组件
- Input - 输入框
- Textarea - 文本域
- Label - 标签

### 自定义组件
- Navigation - 导航栏
- Hero - 首页主视觉区
- Portfolio - 作品集展示
- PortfolioCard - 作品卡片
- About - 关于我
- Contact - 联系方式
- ScrollIndicator - 滚动指示器
- AnimatedText - 动画文字

## 动画实现规划

| 动画效果 | 库 | 实现方式 | 复杂度 |
|---------|-----|---------|-------|
| 导航栏入场 | GSAP | 裁剪路径 + 下滑淡入 | 中 |
| 导航栏滚动毛玻璃 | CSS + React State | backdrop-filter 动态变化 | 低 |
| Hero标题字符交错 | GSAP | SplitText + 交错动画 | 高 |
| Hero背景视差 | GSAP ScrollTrigger | 滚动驱动缩放位移 | 中 |
| 滚动指示器弹跳 | CSS Keyframes | 无限循环动画 | 低 |
| 作品卡片3D翻转 | GSAP | rotateY + 透视 | 高 |
| 作品卡片悬停 | CSS | transform + shadow | 低 |
| 关于图片圆形揭示 | GSAP | clip-path 动画 | 中 |
| 文字逐行揭示 | GSAP ScrollTrigger | 交错入场 | 中 |
| 表单输入动画 | CSS | 下划线绘制 + 标签浮动 | 低 |
| 社交图标悬停 | CSS | scale + rotate | 低 |

## 项目结构

> 实际代码位于 `app/` 目录，下方结构以 `app/` 为根路径。

```
app/
├── public/
│   └── images/          # 静态图片资源
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui 组件
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Portfolio.tsx
│   │   ├── PortfolioDetail.tsx
│   │   ├── Favorites.tsx
│   │   ├── Carousel.tsx
│   │   ├── Slideshow.tsx
│   │   ├── Lightbox.tsx
│   │   ├── ImageFilters.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Navigation.tsx
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## 安装与启动

### 环境要求

- Node.js 18+
- npm 9+（或兼容的包管理器，如 pnpm / yarn）

### 图片优化（本地生成）

本项目继续使用本地图片（`app/public/images`），但图片会按照业务类别拆分存放在子目录中（例如 `city` / `nature` / `life` 等）；在开发/构建前会自动生成优化版本，并在 `optimized` 目录下以相同的子目录结构输出，以提升加载速度与响应式体验。

- 原图目录：`app/public/images/`，支持多级子目录（如 `images/city/osaka-1.jpg`）
- 生成目录：`app/public/images/optimized/`（已加入 `.gitignore`，不提交；结构镜像原始目录，例如 `images/optimized/city/osaka-1-1280.webp`）
- 生成内容：**仅 WebP 多尺寸变体**，命名为 `{subdir}/{name}-{width}.webp`，统一宽度档位为 `96/128/160/256/320/480/640/960/1280/1600/1920/2560`；压缩脚本会避免放大生成超过原始宽度的尺寸，跳过已存在且未变更的文件，并清理掉已无对应原图或非 WebP 的旧优化文件，保证输出目录干净可控。

#### 更换图片后的重新生成与刷新

如果你替换了 `app/public/images/*.jpg/png` 的内容但文件名不变（例如 `avatar.jpg`），需要重新生成对应的优化图片；只修改 `app/dist/` 属于修改构建产物，不会影响生成结果与页面引用。生成的优化文件将是对应的 WebP 多尺寸变体。

推荐流程：

```bash
cd app
touch public/images/avatar.jpg
npm run images:optimize
```

如需更新生产构建：

```bash
cd app
npm run build
```

浏览器若仍显示旧图，执行硬刷新（Cmd+Shift+R / Ctrl+Shift+R）。

如果你批量替换/删除了很多图片，推荐直接全量重建 optimized：

```bash
cd app
npm run images:rebuild
```

手动生成：

```bash
cd app
npm run images:optimize
```

### 安装依赖（在 app 目录下执行）

```bash
cd app

# 安装项目依赖
npm install
```

### 开发环境启动（在 app 目录下执行）

```bash
cd app

# 启动本地开发服务器（默认端口 5173）
npm run dev
```

### 构建与预览（在 app 目录下执行）

```bash
cd app

# 生产构建
npm run build

# 本地预览生产构建
npm run preview
```

### 常见问题：esbuild 版本不匹配

如果 `npm run preview` 报错（Host version 与 binary version 不一致），通常是本地依赖安装状态异常导致。

优先执行：

```bash
cd app
npm ci
```

如仍未解决，可再尝试：

```bash
cd app
npm rebuild esbuild
```

## 依赖安装

```bash
# 动画库
npm install gsap @gsap/react

# 图标
npm install lucide-react
```

## 颜色配置

```javascript
// tailwind.config.js
colors: {
  black: '#000000',
  white: '#FFFFFF',
  grey: '#8F8F8F',
  'light-grey': '#E9E9E9',
  'dark-bg': '#1A1A1A',
}
```

## 字体配置

```css
/* 引入字体 */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
```

## 响应式断点

- Desktop: > 991px
- Tablet: 768px - 991px
- Mobile: < 768px
- Small Mobile: < 479px

## 性能优化

- 使用 `will-change` 优化动画元素
- 图片懒加载 + 异步解码（`loading="lazy"` / `decoding="async"`）
- 首屏图片高优先级与预加载（`fetchpriority="high"` + preload）
- 响应式图片（`<picture>` + `srcset/sizes`，按屏幕下发合适尺寸）
- CSS `contain` 属性隔离动画区域
- 尊重 `prefers-reduced-motion`
