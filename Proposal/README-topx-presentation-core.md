# TOPX Presentation Core 使用指南

基于 **CIX-TOPX-2026** 提案沉淀的可复用演示稿视觉与布局核心样式表，适用于品牌统一的提案、汇报或产品演示页面。

---

## 1. 引入方式

在 HTML 的 `<head>` 中引入样式表：

```html
<link rel="stylesheet" href="topx-presentation-core.css">
```

若使用本地字体（如 Inter），建议在样式表之前引入：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">
<link rel="stylesheet" href="topx-presentation-core.css">
```

---

## 2. 必需的 HTML 结构

### 2.1 整体结构

- **`#deck`**：幻灯片容器，内部为多张 `.slide`，通过 `transform` 横向切换。
- **`.slide`**：单张幻灯片，需设置 `data-title`（用于打印页眉与导航标题）。
- **`.slide-inner`**：幻灯片内容包裹层，用于居中与最大宽度限制（1200px）。

示例：

```html
<div id="deck">
  <section class="slide" data-title="封面">
    <div class="slide-inner">...</div>
  </section>
  <section class="slide" data-title="目录">
    <div class="slide-inner">...</div>
  </section>
  <!-- 更多 .slide -->
</div>
```

### 2.2 导航与控件

| 元素 | ID / 说明 |
|------|------------|
| 顶部导航栏 | `#navbar`，内含 `.nav-logo`、`.slide-counter`、`.nav-title` 等 |
| 页码点 | `#dots`，内部为多个 `.dot`，当前页加 `.active` |
| 上一页 | `#arrow-prev`，需加 class `nav-arrow` |
| 下一页 | `#arrow-next`，需加 class `nav-arrow` |
| 底部进度条 | `#progress-bar`，宽度由 JS 根据当前页索引计算 |

深色幻灯片（如封面、结尾）时，给 `#navbar` 加上 class **`on-dark`**，导航会变为深色样式。

---

## 3. 幻灯片背景与版式

通过给 `.slide` 增加修饰 class 切换背景：

| Class | 效果 |
|-------|------|
| （无） | 白底 |
| `slide--dark` | 深蓝渐变（主色系） |
| `slide--light` | 浅灰背景 |
| `slide--sky` | 天空蓝渐变 |
| `slide--video` | 黑底、无内边距，适合全屏视频 |

标题与版式类：

- **`.label`**：小节标签（小号大写 + 左侧短线）
- **`.label--white`**：深色背景上的浅色标签
- **`h2.slide-title`** / **`h2.slide-title--white`**：幻灯片主标题
- **`.lead`** / **`.lead--white`**：副标题/摘要
- **`.divider`** / **`.divider--white`**：装饰分隔线
- **`.highlight`**：渐变高亮文字
- **`.accent`**：主色强调文字

---

## 4. 布局与组件

- **栅格**：`.g2`（两列）、`.g3`（三列）、`.g4`（四列）。
- **剧场布局**：`.theater` 内 `.theater-media`（主视觉）+ `.theater-side`（侧边说明）。
- **卡片**：`.card`、`.card--blue`、`.card--sky`；标题用 `.card-title`，副文用 `.card-sub`。
- **图标圆**：`.icon-circle`。
- **标签**：`.tag`、`.tag-pro`（正向）、`.tag-con`（注意/负向）。

页码角标：在 `.slide` 内放一个元素，class 为 **`.slide-num-badge`**，文字内容由 JS 或服务端输出即可（样式已固定位置与字号）。

---

## 5. 入场动效

为需要「进入动画」的元素加上 **`.anim`**。当前幻灯片被加上 **`.active`** 时，这些元素会按顺序淡入上移；子元素可用 `nth-child` 延迟（样式表已写好前 6 个的 delay）。

切换当前页时，需由 JS 控制：

- `#deck` 的 `transform: translateX(-index * 100vw)`
- 对应 `.slide` 添加 `.active`，其余移除
- `#dots` 中对应 `.dot` 添加 `.active`
- `#progress-bar` 的 `width` = `(index / (total - 1)) * 100%`
- `#navbar` 的 `.nav-title`、`.slide-counter` 更新为当前页的 `data-title` 与页码

---

## 6. 主题与变量

所有主色、圆角、阴影、动效时间均通过 **CSS 变量** 定义在 `:root` 中，便于项目级覆盖。常用变量示例：

- `--vw-blue`、`--vw-mid`、`--vw-light`、`--vw-sky`、`--vw-accent`
- `--text-main`、`--text-sub`
- `--shadow-sm`、`--shadow-md`、`--radius`、`--radius-lg`
- `--font`、`--tr`、`--slide-dur`

---

## 7. 可选 body 状态

- **`body.video-mode`**：隐藏顶部导航、页码点、左右箭头，适合全屏播放或录屏。
- **`body.nav-light`**（或 `c-car-detail-nav-light`）：强制导航栏为浅色样式（例如在深色页上希望白底导航时使用）。

---

## 8. 打印与 PDF 导出

样式表已包含 **打印样式**：每张 `.slide` 占一页，页眉为「当前页 / 总页数 · 幻灯片标题」（标题来自 `data-title`）。

- **总页数** 由变量 **`--topx-total-slides`** 控制，请在 CSS 或页面内覆盖为实际幻灯片数量，例如：

  ```css
  :root { --topx-total-slides: 42; }
  ```

- 导出 PDF：浏览器中 **打印（Cmd+P / Ctrl+P）** → 目标选择「另存为 PDF」即可。

---

## 9. 响应式

- 小屏下 `.slide` 左右内边距缩小，`.g4` 变为两列，`.theater` 改为单列布局，其他栅格与组件保持可用。

---

## 10. 与现有 CIX-TOPX-2026 提案的关系

- **Proposal/index.html** 内原有 `<style>` 为「页面专属」样式；**topx-presentation-core.css** 仅保留与「演示壳、版式、卡片、栅格、剧场、打印」相关的通用逻辑。
- 新项目可直接引用 **topx-presentation-core.css**，再在页面内或单独 CSS 中补充项目专属样式（如特定插图、表格、时间轴等），以保持视觉一致且便于维护。
