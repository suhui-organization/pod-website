# pod — 项目介绍页

`pod` 的官方介绍页。Vue 3 + Vite + TypeScript，构建产物为纯静态文件，中英双语。

## 开发

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 类型检查 + 产物输出到 dist/
pnpm preview    # 本地预览构建产物
```

## 页面顺序

能做什么 → 怎么用 → 试一下 → 截图 → 证据 → 对比 → 边界 → 上手。

功能清单排在 hero 正下方，是因为它曾经排在第 5 位、距顶部 4.3 屏——访客要滚过整个
产品说辞才知道这工具能干什么。改顺序前先想清楚这一点。

## 目录

```
src/
  main.ts                  入口，挂载 App
  App.vue                  页面骨架（各 section 的组装顺序）
  styles/
    tokens.css             设计令牌：颜色（OKLCH）、字体、间距、动效、深色段、z-index
    base.css               重置、排版、按钮、verdict 徽章、reveal 动画
  lib/
    i18n.ts                语言状态：检测 / 持久化 / 同步 <html lang> 与 title
    compiler.ts            最小权限编译逻辑（四处 UI 共用，带中英文措辞）
    content.ts             全部文案与数据（中英各一份）＋ 示例语料
  composables/
    useReveal.ts           滚动进场（可降级：内容默认可见）
    useEntered.ts          「首次进入视口」开关，供两个动画组件复用
    useCopy.ts             复制到剪贴板（含非安全上下文的回退）
  components/
    SiteNav.vue            顶部导航（含语言开关、移动端抽屉）
    LanguageToggle.vue     中 / EN 药丸开关
    HeroSection.vue        首屏（宽屏双栏：文案 + 编译动画）
    CompileVisual.vue      24 个真实能力经 compileRule() 逐个判定
    PipelineLoop.vue       record → compile → enforce → prove
    CompilerDemo.vue       交互演示：点任意一条观察，看判定与出处
    PolicyPanel.vue        编译产物：策略 diff 表（由 compileRule() 现场计算）
    ScreensSection.vue     产品截图（原生 <dialog> 大图查看）
    EvidenceBand.vue       深色证据段：哈希链逐环点亮
    CapabilityMap.vue      能力总览 bento（2 宽 + 6 普通，每块以命令收尾）
    PositioningSection.vue 与同类工具的位置 + pod 是 / 不是
    LimitsSection.vue      诚实的边界
    StartSection.vue       安装、快速开始、支持的 agent、仓库地址
    SiteFooter.vue         页脚
    CopyField.vue          命令 + 复制按钮
    VerdictPill.vue        allow / approve / deny / unlisted 徽章
    BrandIcon.vue          图标（GitHub / Gitee / 箭头 / 复制 / 对勾）
    PodMark.vue            品牌标记（三段递减的横条）
public/fonts/              自托管的拉丁字形（Schibsted Grotesk / Spline Sans Mono）
public/shots/              产品截图（本地控制台，示例数据）
```

## 部署

静态站点，`dist/` 直接托管即可（Vercel / Netlify / 任意对象存储）。

```bash
pnpm build
```

字体与样式全部本地化，页面不依赖任何外部 CDN——这一点对国内的访问环境是刻意的。

## 改动须知

- **颜色改动先验证对比度。** 正文 ≥ 4.5:1，非文本元素 ≥ 3:1。`tokens.css` 里每个
  墨色都标注了实测比值，改值时要一起更新；深色段是另算的一套，不是浅色令牌调暗。
- **改动 `compileRule()` 会同时影响四处**：首屏编译动画、能力 bento 里的 diff 微缩图、
  交互演示、以及编译产物表。页面上没有写死的结论，这是刻意的。
- **改文案要同时改 `zh` 和 `en`。** 两份都是完整的，英文不是中文的附属。英文比中文
  长约 30%，改完要在两种语言下各扫一遍溢出。
- **改变响应式栅格时保留 `minmax(min(Npx, 100%), 1fr)` 里的 `min()`。** 去掉它会让
  窄屏（< 360px）整页横向溢出。
- **截图必须来自真实界面，且不能含真实数据。** `public/shots/` 里的两张是本地控制台
  （`pod ui`）对着一个临时 `~/.pod` 拍的，数据是合成的。重拍方式见下。
- 设计上下文见 `PRODUCT.md`（策略与受众）与 `DESIGN.md`（视觉系统）。

## 重新拍控制台截图

当前 `public/shots/` 的两张来自 **Pod Cloud** 控制台（`kubectl port-forward` 暴露的
实例，如 `http://127.0.0.1:18088`）。

### 1. 脱敏是必须的，不是可选的

控制台**每个页面右上角都显示登录账号的邮箱**。直接拍就等于把你的真实邮箱发到官网上。
截图前先把它换掉：

```js
// Playwright：替换右上角账号，再截图
await page.evaluate(() => {
  const menu = document.querySelector('.user-menu') || document.body
  menu.querySelectorAll('*').forEach((el) => {
    if (el.children.length > 0) return
    const t = (el.textContent || '').trim()
    if (!t || t.length > 40) return
    if (t.includes('@')) el.textContent = 'demo@local'   // 邮箱
    else if (t === 'WA') el.textContent = 'DE'           // 头像首字母
  })
})
```

**拍完必须 OCR 成品 PNG 复核**——DOM 里查不到不代表像素上没有。这一步抓到过一次真问题：

```bash
swift /tmp/ocr.swift public/shots/*.png | grep -iE "@gmail|@qq|@163|@outlook|密码"
```

顺带：`SecurityHarness/profile-dark.png` 和 `login-zh.png` 里各有一个真实邮箱，
**不要**直接拿来用。

### 2. 哪几页可以拍

- 可以：总览、Agent 资产、告警、时间线、控制平面、调用链、策略中心、规则包、加固报告
- **不要拍「订阅」**：那里有一行「Stripe 未配置：升级走开发模式免支付切换」
- **不要拍「个人资料」**：邮箱、姓名、租户、改密表单全在上面
- **不要拍「成员管理」**：同理由

### 3. 截图高度的坑

控制台用的是内部滚动容器（`el-scrollbar`），`fullPage: true` **截不到**滚动区之外的内容。
要按视口高度截，并且挑一个正好落在面板边界的高度——面板行是 **306px 一档**（1440 宽下
顶边在 231 / 553 / 875 / 1197），否则会切在图表中间。取 1181 正好收在第 3 行底部。

### 4. 本地控制台（`pod ui`）怎么拍

如果你要拍本地控制台而不是云端，**不要对着真实的 `~/.pod`**——用一个临时数据目录：

```bash
mkdir -p /tmp/pod-demo/home/.pod/{policies,audit}
# POD_HOME 在 CLI 里写死，所以直接调 cmdUi 传 podHome；home 取它的父目录。
node -e "import('/ABS/PATH/pod/apps/cli/dist/ui.js').then(({cmdUi})=>cmdUi({podHome:'/tmp/pod-demo/home/.pod',port:8799,token:'shot-token'}))"
# 打开 http://127.0.0.1:8799/?token=shot-token
```

注意别占用 8787 / 8790（用户可能正在跑真实控制台）。

### 5. 收尾

新图放进 `public/shots/`，再更新 `src/lib/content.ts` 里 `screens.shots` 的
`src` / `width` / `height` / `alt` 四项——图按内禀尺寸预留占位，不更新会跳版。
