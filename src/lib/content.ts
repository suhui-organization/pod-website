import type { Observation } from './compiler'

export type Locale = 'zh' | 'en'

/* ------------------------------------------------------------------ repos */

/*
  Not localised: these are identifiers. Commands, repositories and tool names
  are the same in every language — translating them would break copy-paste.
*/
export const REPO = {
  version: 'v0.2.0',
  github: 'https://github.com/suhui-organization/pod',
  gitee: 'https://gitee.com/suhuisoftwares/pod',
  sponsor: 'https://github.com/sponsors/suhui-organization',
} as const

export const INSTALL_COMMAND = `curl -fsSL ${REPO.gitee}/raw/${REPO.version}/scripts/install.sh | sh`
export const INSTALL_MIRROR = `curl -fsSL https://raw.githubusercontent.com/suhui-organization/pod/${REPO.version}/scripts/install.sh | sh`

/** Tiny `{placeholder}` interpolation for the few strings that carry numbers. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}

/* ------------------------------------------------------- shared data shapes */

export interface LoopStep {
  n: string
  name: string
  title: string
  command: string
  body: string
  output: string
}

/**
 * One capability in the page's opening overview.
 *
 * `wide` tiles carry a micro-visual instead of more prose; plain tiles are
 * title + one plain line + the command. The mix is deliberate — eight
 * identically-sized cards is the pattern the layout guidance calls out as the
 * lazily repeated answer.
 */
export interface OverviewTile {
  id: string
  title: string
  body: string
  command: string
  wide?: boolean
  visual?: 'diff' | 'chain'
}

/** A real capture of the product, shown in the screenshot section. */
export interface Shot {
  src: string
  /** Intrinsic size, so the figure reserves space and never shifts on load. */
  width: number
  height: number
  title: string
  body: string
  alt: string
  /** Portrait captures sit in the narrow column next to the wide one. */
  portrait?: boolean
}

export interface Copy {
  meta: { title: string; description: string }

  /** Strings that appear in more than one place. */
  common: { copy: string; copied: string }

  nav: {
    links: Array<{ href: string; label: string }>
    install: string
    openMenu: string
    closeMenu: string
    skip: string
    language: string
    githubTitle: string
    giteeTitle: string
  }

  hero: {
    badges: string[]
    titleA: string
    titleB: string
    lead: string
    ctaPrimary: string
    ctaGithub: string
    ctaGitee: string
    installNote: string
  }

  visual: {
    caption: string
    summary: string
    pending: string
    scanning: string
    done: string
  }

  overview: {
    title: string
    lead: string
    tiles: OverviewTile[]
    moreLabel: string
    commands: string
    cloudNote: string
    docsLabel: string
  }

  loop: { title: string; lead: string; steps: LoopStep[] }

  demo: {
    title: string
    lead: string
    artifactTitle: string
    artifactLead: string
    observedLabel: string
    resultLabel: string
    evidenceLabel: string
    snippetLabel: string
    unlistedSnippet: string
    footnote: string
  }

  screens: {
    title: string
    lead: string
    note: string
    zoom: string
    close: string
    shots: Shot[]
  }

  /** Labels for the compiled-policy table shown as the demo's artifact. */
  artifact: {
    caption: string
    colObserved: string
    colBaseline: string
    colResult: string
    colChange: string
    changeKept: string
    changeTightened: string
    changeRemoved: string
    summary: string
    note: string
  }

  evidence: {
    title: string
    lead: string
    points: Array<{ title: string; body: string }>
    chainCaption: string
    verified: string
    verifying: string
  }

  positioning: {
    title: string
    lead: string
    lanes: Array<{ who: string; what: string; detail: string }>
    isLabel: string
    isNotLabel: string
    rows: Array<[string, string]>
  }

  limits: { title: string; lead: string; items: Array<{ title: string; body: string }> }

  start: {
    title: string
    lead: string
    installLabel: string
    mirrorLabel: string
    installMeta: string
    stepsLabel: string
    steps: Array<{ cmd: string; note: string }>
    agentsLabel: string
    agentCol: string
    transportCol: string
    statusCol: string
    whereLabel: string
    docsLabel: string
  }

  footer: {
    tagline: string
    note: string
    repoTitle: string
    docsTitle: string
    legalTitle: string
    links: {
      github: string
      gitee: string
      changelog: string
      license: string
      security: string
      sponsor: string
    }
    bottom: string
  }
}

/* ------------------------------------------------- the shared demo corpus */

/*
  Seeded from the demo corpus in the README (scripts/demo-least-privilege.sh):
  a realistic week of tool calls containing reads, writes, a delete, and one
  `.env` access. Same shape, same numbers, so the page and the CLI agree.
*/
export const CORPUS: Observation[] = [
  { id: 'read_file', server: 'filesystem', tool: 'read_file', calls: 214, effect: 'read', sensitiveHits: 1, hosts: [] },
  { id: 'write_file', server: 'filesystem', tool: 'write_file', calls: 38, effect: 'write', sensitiveHits: 0, hosts: [] },
  { id: 'delete_file', server: 'filesystem', tool: 'delete_file', calls: 2, effect: 'destroy', sensitiveHits: 0, hosts: [] },
  { id: 'get_file_info', server: 'filesystem', tool: 'get_file_info', calls: 0, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'create_pull_request', server: 'github', tool: 'create_pull_request', calls: 6, effect: 'write', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'execute_command', server: 'shell', tool: 'execute_command', calls: 12, effect: 'exec', sensitiveHits: 0, hosts: [] },
]

/*
  The hero visual's surface: the same compiler, run over a wider slice of the
  same week. 24 capabilities → 8 allowed · 9 need approval · 3 blocked ·
  4 never used.
*/
export const HERO_CAPABILITIES: Observation[] = [
  { id: 'h1', server: 'filesystem', tool: 'read_file', calls: 214, effect: 'read', sensitiveHits: 1, hosts: [] },
  { id: 'h2', server: 'filesystem', tool: 'list_directory', calls: 96, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h3', server: 'filesystem', tool: 'search_files', calls: 41, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h4', server: 'filesystem', tool: 'write_file', calls: 38, effect: 'write', sensitiveHits: 0, hosts: [] },
  { id: 'h5', server: 'filesystem', tool: 'edit_file', calls: 22, effect: 'write', sensitiveHits: 0, hosts: [] },
  { id: 'h6', server: 'filesystem', tool: 'create_directory', calls: 3, effect: 'write', sensitiveHits: 0, hosts: [] },
  { id: 'h7', server: 'filesystem', tool: 'move_file', calls: 4, effect: 'write', sensitiveHits: 0, hosts: [] },
  { id: 'h8', server: 'filesystem', tool: 'delete_file', calls: 2, effect: 'destroy', sensitiveHits: 0, hosts: [] },
  { id: 'h9', server: 'filesystem', tool: 'get_file_info', calls: 0, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h10', server: 'github', tool: 'get_file_contents', calls: 18, effect: 'read', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'h11', server: 'github', tool: 'list_issues', calls: 12, effect: 'read', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'h12', server: 'github', tool: 'create_pull_request', calls: 6, effect: 'write', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'h13', server: 'github', tool: 'push_files', calls: 1, effect: 'write', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'h14', server: 'github', tool: 'create_issue', calls: 2, effect: 'write', sensitiveHits: 0, hosts: ['api.github.com'] },
  { id: 'h15', server: 'github', tool: 'merge_pull_request', calls: 0, effect: 'destroy', sensitiveHits: 0, hosts: [] },
  { id: 'h16', server: 'shell', tool: 'execute_command', calls: 12, effect: 'exec', sensitiveHits: 0, hosts: [] },
  { id: 'h17', server: 'shell', tool: 'list_processes', calls: 7, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h18', server: 'shell', tool: 'kill_process', calls: 0, effect: 'destroy', sensitiveHits: 0, hosts: [] },
  { id: 'h19', server: 'browser', tool: 'navigate', calls: 26, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h20', server: 'browser', tool: 'fetch_url', calls: 9, effect: 'read', sensitiveHits: 0, hosts: ['docs.example.com'] },
  { id: 'h21', server: 'secrets', tool: 'read_env', calls: 3, effect: 'read', sensitiveHits: 3, hosts: [] },
  { id: 'h22', server: 'secrets', tool: 'read_ssh_key', calls: 0, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h23', server: 'memory', tool: 'read_memory', calls: 14, effect: 'read', sensitiveHits: 0, hosts: [] },
  { id: 'h24', server: 'memory', tool: 'write_memory', calls: 5, effect: 'write', sensitiveHits: 0, hosts: [] },
]

/* ------------------------------------------------------------------- copy */

const zh: Copy = {
  meta: {
    title: 'pod — 让你的 AI 助手只拿到该拿的权限',
    description:
      'pod 先观察你的 AI 助手实际用过哪些工具，再自动写出一份权限清单：该放行的放行，该拦下的拦下。全部在本机运行，开源免费。',
  },
  common: { copy: '复制', copied: '已复制' },
  nav: {
    links: [
      { href: '#capabilities', label: '能做什么' },
      { href: '#loop', label: '怎么用' },
      { href: '#demo', label: '试一下' },
      { href: '#screens', label: '截图' },
      { href: '#evidence', label: '证据' },
      { href: '#start', label: '上手' },
    ],
    install: '安装',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    skip: '跳到主要内容',
    language: '切换语言',
    githubTitle: '在 GitHub 上看代码',
    giteeTitle: 'Gitee 镜像（国内更快）',
  },
  hero: {
    badges: ['开源免费', '数据不出本机', REPO.version],
    titleA: '你的 AI 助手',
    titleB: '能碰到的东西，比你以为的多',
    lead: 'pod 先看它实际用过什么，再自动写出一份权限清单——该放行的放行，该拦下的拦下。不用你手写规则，也不用读懂代码。',
    ctaPrimary: '开始安装',
    ctaGithub: 'GitHub 看代码',
    ctaGitee: 'Gitee 镜像',
    installNote: '从源码构建，不需要注册账号。需要 Node.js 22 或更新版本。',
  },
  visual: {
    caption: 'pod 根据真实使用记录，为这个助手生成的权限清单',
    summary: '放行 {allow} 项 · 要你点头 {approve} 项 · 直接拦下 {deny} 项 · 没用到 {unlisted} 项',
    pending: '待判断',
    scanning: '正在判断',
    done: '判断完成',
  },
  overview: {
    title: '它能做什么',
    lead: '八件事，覆盖从「先看清有什么」到「事后能证明」。每一件都对应一条命令。',
    tiles: [
      {
        id: 'policy',
        wide: true,
        visual: 'diff',
        title: '一份不用你手写的权限清单',
        body: '照着它真实用过的东西生成：该放行的放行，该拦下的拦下。你不用读懂策略，也不用猜。',
        command: 'pod policy draft',
      },
      {
        id: 'audit',
        wide: true,
        visual: 'chain',
        title: '改不掉的操作记录',
        body: '每次操作串成一条链。改任何一环，整条链立刻对不上，而且会指出断在哪。',
        command: 'pod verify-audit',
      },
      {
        id: 'scan',
        title: '先只看一眼',
        body: '这台机器上有哪些 AI 工具、各自能碰到什么。只看，不改。',
        command: 'pod scan',
      },
      {
        id: 'approve',
        title: '危险操作等你点头',
        body: '会暂停下来，等你在另一个终端点「批准」。你不理它，就当作拒绝。',
        command: 'pod watch',
      },
      {
        id: 'secrets',
        title: '碰到密钥就拦下',
        body: '读到 .env、.ssh 这类文件直接拦；认不出的密钥格式也能靠特征认出来。',
        command: 'pod serve',
      },
      {
        id: 'environment',
        title: '运行环境也一起管',
        body: '插件被偷偷挂钩子、配置被改掉、长期记忆被污染，都会被发现。',
        command: 'pod posture',
      },
      {
        id: 'recover',
        title: '出事了能说清，也能恢复',
        body: '导出一份凭据包，对方自己跑一条命令就能核；高危写操作前会拍快照，能回滚。',
        command: 'pod export-evidence',
      },
      {
        id: 'coverage',
        title: '谁在绕过检查',
        body: '有工具没走 pod？直接列出来，退出码能挂进 CI。',
        command: 'pod coverage',
      },
    ],
    moreLabel: '还有这些命令',
    commands:
      'pod record · pod lint · pod rules · pod identity · pod delegate · pod grant · pod quarantine · pod trace · pod anomaly · pod timeline · pod digest',
    cloudNote: '需要跨机器统一查看时，可以自己搭一个云端控制台——不装也完全能用。',
    docsLabel: '完整命令与文档',
  },
  loop: {
    title: '四步，把「随便用」变成「有规矩」',
    lead: '先只看不拦，再看清它到底用了什么，然后按规矩放行，最后留下凭据。每一步都能单独用，连起来才是完整的。',
    steps: [
      {
        n: '01',
        name: 'watch',
        title: '先观察',
        command: 'pod record',
        body: '让助手照常工作几天。pod 只在旁边记录它调用过什么，不拦任何操作，也不改变它的行为。',
        output: '一份真实使用记录',
      },
      {
        n: '02',
        name: 'compile',
        title: '写清单',
        command: 'pod policy draft',
        body: '把这份记录变成权限清单，并告诉你哪几条被收紧了、哪一条因为从没出现过而被删掉。',
        output: '权限清单 + 变化对照',
      },
      {
        n: '03',
        name: 'enforce',
        title: '按规矩放行',
        command: 'pod serve',
        body: '之后每次调用都先过一遍清单：该放的直接放，危险的等你点一下头，不该做的直接拦下。清单里没有的，一律不放。',
        output: '每一次的判断',
      },
      {
        n: '04',
        name: 'prove',
        title: '留下凭据',
        command: 'pod verify-audit',
        body: '每一步操作都留下改不掉的记录。真出了事，五分钟就能说清楚昨晚到底发生了什么。',
        output: '可以给别人核对的凭据',
      },
    ],
  },
  demo: {
    title: '点一下，看它怎么判断',
    lead: '下面是同一份使用记录。点任意一条，看 pod 给出什么结论，以及这个结论是从哪来的。',
    artifactTitle: '完整清单长什么样',
    artifactLead: '同一份记录编译出来的结果：左边是原来（全部允许），右边是 pod 收紧之后。',
    observedLabel: '实际用过的工具（7 天）',
    resultLabel: 'pod 的判断',
    evidenceLabel: '依据',
    snippetLabel: '写进清单的内容',
    unlistedSnippet: '// 没被用到过，不写进清单',
    footnote:
      '判断规则不写死在代码里。想更严一点还是更松一点，改一个文件就行；改错了它会直接报错并停下，而不是悄悄放行。',
  },
  screens: {
    title: '它长什么样',
    lead: '这是 Pod Cloud 控制台：跨机器把所有 agent 的权限、调用和告警汇到一处。本地控制台（pod ui）是同一套信息架构的单机版。',
    note: '截图中的账号已脱敏。',
    zoom: '点开看大图',
    close: '关闭',
    shots: [
      {
        src: '/shots/cloud-overview-1440.png',
        width: 1440,
        height: 1181,
        title: '总览',
        body: '累计审计事件、在线 agent、未解决告警，以及近 7 天的事件趋势、决策分布和告警类型。',
        alt: 'Pod Cloud 总览页：2208 条累计审计事件、3 个 agent 全部在线、186 条未解决告警，下方是近 7 天事件趋势与决策分布图表。',
      },
      {
        src: '/shots/cloud-agents-760.png',
        width: 760,
        height: 759,
        title: 'Agent 资产（窄屏）',
        body: '每个 agent 一行：平台、审计事件数、最近同步时间，以及接入命令、熔断、删除三个操作。',
        alt: 'Pod Cloud 的 Agent 资产页在 760px 宽度下的排布，列出 codex、openclaw、hermes 三个 agent 的状态、事件数与最近同步时间。',
        portrait: true,
      },
    ],
  },
  artifact: {
    caption: 'pod 根据真实使用记录，为这个助手生成的权限清单',
    colObserved: '实际用过的工具',
    colBaseline: '原来的状态',
    colResult: 'pod 的判断',
    colChange: '变化',
    changeKept: '不动',
    changeTightened: '收紧',
    changeRemoved: '移除',
    summary: '放行 {allow} 项 · 要你点头 {approve} 项 · 直接拦下 {deny} 项 · 没用到 {unlisted} 项',
    note: '原来的状态是「全部允许」——一份从没收紧过的权限清单，等于没有清单。',
  },
  evidence: {
    title: '每一步，都留下改不掉的凭据',
    lead: 'pod 把每次操作串成一条链。改任何一环，整条链立刻对不上。而验证这件事，不需要你相信我们。',
    points: [
      { title: '改不掉', body: '每次操作都进链，事后改动会被立刻发现，并指出第一处断裂在哪。' },
      { title: '不存原文', body: '链上只保存指纹，不保存内容本身。密钥和隐私不会进日志。' },
      { title: '别人能验', body: '导出一份凭据包，对方自己跑一条命令就能验证，不用听你解释。' },
    ],
    chainCaption: '每次操作一个指纹，环环相扣',
    verified: '链条完整，没有被改动过',
    verifying: '正在核对…',
  },
  positioning: {
    title: '和别的工具比，差在哪',
    lead: '已经有两类工具了：一类告诉你「它可能碰到什么」，一类给你一个执行规则的地方。但它们都不替你写规则。pod 补的是中间这一步。',
    lanes: [
      { who: '系统自带的防护', what: '守住一个助手', detail: '各管各的' },
      { who: 'MCP 网关', what: '给你一个执行规则的地方', detail: '规则还得自己写' },
      { who: '安全扫描工具', what: '告诉你哪里有暴露', detail: '不告诉你该允许什么' },
      { who: 'pod', what: '看它实际怎么用，把规则写出来', detail: '观察 → 编译 → 执行 → 证明' },
    ],
    isLabel: 'pod 是',
    isNotLabel: 'pod 不是',
    rows: [
      ['替你写规则，而不是让你手写', '不是沙箱，不负责隔离环境'],
      ['每次调用都要先过它这一关', '不替代助手自带的安全措施'],
      ['留下可以拿给别人核对的凭据', '不做内容审查，不判断回答对不对'],
      ['全部数据留在你自己机器上', '不是必须联网才能用的云服务'],
    ],
  },
  limits: {
    title: '它做不到什么',
    lead: '先把边界说清楚，你才好判断要不要用。下面这些不在 pod 的覆盖范围内。',
    items: [
      { title: '不做隔离', body: '它只是拦在中间转发，不是沙箱。真要强隔离，得靠容器或系统自带的能力——pod 的清单和凭据可以叠在上面。' },
      { title: '看不到助手之间的对话', body: '它只看得到工具调用，看不到 AI 之间交流的内容。' },
      { title: '防不住整台电脑被攻破', body: '如果电脑本身已经被完全控制，pod 也救不了。这种情况要靠减少暴露面、把不同任务分到不同机器来缓解。' },
      { title: '不靠「行为异常」当主力', body: 'AI 的行为会随提示词变化，靠统计判断异常，误报多到没法用。pod 的主力是明确的规则，异常检测只作参考。' },
      { title: '不支持跨公司通信', body: '没有实现 mTLS、SPIFFE 这类跨组织协议。跨公司的助手协作不在范围内。' },
    ],
  },
  start: {
    title: '五分钟上手',
    lead: '先只看一眼，再决定要不要让它接管。全程在你本机，不需要注册。',
    installLabel: '安装',
    mirrorLabel: '国内镜像（GitHub 连不上时用这条）',
    installMeta: '装到 ~/.pod/src，然后把 pod 命令放进 ~/.local/bin。需要 Node.js 22 或更新版本，以及 git。',
    stepsLabel: '从零到生效',
    steps: [
      { cmd: 'pod scan', note: '只看一眼现在的情况，不改动任何东西。' },
      { cmd: 'pod onboard --yes', note: '让 pod 接管观察。原来的配置会留一份备份，随时可以撤。' },
      { cmd: 'pod policy draft --diff <baseline>', note: '用真实记录生成权限清单，并告诉你收紧了哪些。' },
      { cmd: 'pod serve --agent <name> --policy draft.json', note: '正式生效，开始按清单放行。' },
      { cmd: 'pod verify-audit', note: '核对记录有没有被改过，顺便导出凭据包。' },
    ],
    agentsLabel: '已经验证过的助手',
    agentCol: '助手',
    transportCol: '接入方式',
    statusCol: '状态',
    whereLabel: '在哪里找到它',
    docsLabel: '文档',
  },
  footer: {
    tagline: '让你的 AI 助手只拿到该拿的权限。',
    note: '数据不出你的机器。开源，Apache-2.0。',
    repoTitle: '代码',
    docsTitle: '文档',
    legalTitle: '许可与支持',
    links: {
      github: 'GitHub',
      gitee: 'Gitee 镜像',
      changelog: '更新日志',
      license: 'Apache-2.0 许可',
      security: '安全说明',
      sponsor: '赞助（不解锁任何功能）',
    },
    bottom: '核心功能本地全都有，没有锁在赞助后面。',
  },
}

const en: Copy = {
  meta: {
    title: 'pod — give your AI agent only the access it needs',
    description:
      'pod watches what your AI agent actually uses, then writes its permission list for you — allowing what it needs and blocking the rest. Runs entirely on your machine. Free and open source.',
  },
  common: { copy: 'Copy', copied: 'Copied' },
  nav: {
    links: [
      { href: '#capabilities', label: 'Features' },
      { href: '#loop', label: 'How it works' },
      { href: '#demo', label: 'Try it' },
      { href: '#screens', label: 'Screens' },
      { href: '#evidence', label: 'Evidence' },
      { href: '#start', label: 'Get started' },
    ],
    install: 'Install',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skip: 'Skip to content',
    language: 'Change language',
    githubTitle: 'Read the source on GitHub',
    giteeTitle: 'Gitee mirror (faster in mainland China)',
  },
  hero: {
    badges: ['Open source', 'Stays on your machine', REPO.version],
    titleA: 'Your AI agent can reach',
    titleB: 'far more than it needs',
    lead: 'pod watches what it actually uses, then writes the permission list for you — allowing what it needs, blocking the rest. Nothing to hand-write, nothing to reverse-engineer.',
    ctaPrimary: 'Install pod',
    ctaGithub: 'Read the source',
    ctaGitee: 'Gitee mirror',
    installNote: 'Builds from source. No account required. Needs Node.js 22 or newer.',
  },
  visual: {
    caption: 'The permission list pod writes for this agent, derived from real usage',
    summary: '{allow} allowed · {approve} need your approval · {deny} blocked · {unlisted} never used',
    pending: 'pending',
    scanning: 'Compiling',
    done: 'Compiled',
  },
  overview: {
    title: 'What it does',
    lead: 'Eight things, from seeing the surface to proving what happened. Each one is a command.',
    tiles: [
      {
        id: 'policy',
        wide: true,
        visual: 'diff',
        title: 'A permission list you never have to write',
        body: 'Built from what the agent actually used: what it needs passes, the rest is blocked. No policy prose to read, nothing to guess at.',
        command: 'pod policy draft',
      },
      {
        id: 'audit',
        wide: true,
        visual: 'chain',
        title: 'A record nobody can quietly edit',
        body: 'Every action joins a chain. Change one link and the whole chain stops matching — and the break is named.',
        command: 'pod verify-audit',
      },
      {
        id: 'scan',
        title: 'Look first',
        body: 'Which AI tools are on this machine and what each one can reach. Read-only.',
        command: 'pod scan',
      },
      {
        id: 'approve',
        title: 'Risky calls wait for you',
        body: 'They pause until you approve from another terminal. Ignore the request and it counts as a no.',
        command: 'pod watch',
      },
      {
        id: 'secrets',
        title: 'Secrets get blocked',
        body: 'Reads of .env or .ssh stop here, and unrecognised key formats are caught by shape.',
        command: 'pod serve',
      },
      {
        id: 'environment',
        title: 'The environment is watched too',
        body: 'A plugin that adds a hook after updating, a flipped config, a poisoned memory — all of it surfaces.',
        command: 'pod posture',
      },
      {
        id: 'recover',
        title: 'Explain it, and undo it',
        body: 'Export an evidence bundle the other side verifies themselves; snapshots make high-risk writes reversible.',
        command: 'pod export-evidence',
      },
      {
        id: 'coverage',
        title: 'See what bypasses it',
        body: 'A tool that skips pod is listed outright, and the exit code drops straight into CI.',
        command: 'pod coverage',
      },
    ],
    moreLabel: 'Also available',
    commands:
      'pod record · pod lint · pod rules · pod identity · pod delegate · pod grant · pod quarantine · pod trace · pod anomaly · pod timeline · pod digest',
    cloudNote: 'When you want one view across machines, self-host the console — skipping it changes nothing.',
    docsLabel: 'Full command reference',
  },
  loop: {
    title: 'Four steps from “anything goes” to “there are rules”',
    lead: 'Watch first, then see what it really used, then enforce, then keep the receipts. Every step works on its own — the loop is what makes it hold.',
    steps: [
      {
        n: '01',
        name: 'watch',
        title: 'Watch it work',
        command: 'pod record',
        body: 'Let the agent run normally for a few days. pod sits alongside and writes down what it calls. Nothing is blocked, nothing changes.',
        output: 'A real usage record',
      },
      {
        n: '02',
        name: 'compile',
        title: 'Write the list',
        command: 'pod policy draft',
        body: 'Turns that record into a permission list, and shows which entries got tightened and which were dropped for never being used.',
        output: 'Permission list + a diff',
      },
      {
        n: '03',
        name: 'enforce',
        title: 'Enforce it',
        command: 'pod serve',
        body: 'From then on every call goes through the list first: safe calls pass, risky ones wait for your nod, destructive ones are stopped. Anything unlisted is denied.',
        output: 'A verdict per call',
      },
      {
        n: '04',
        name: 'prove',
        title: 'Keep receipts',
        command: 'pod verify-audit',
        body: 'Every action leaves a record that cannot be quietly edited. If something goes wrong, five minutes gets you a straight answer about last night.',
        output: 'Evidence someone else can check',
      },
    ],
  },
  demo: {
    title: 'Click one and see the reasoning',
    lead: 'Below is the same usage record. Pick any tool to see what pod concluded, and where that conclusion came from.',
    artifactTitle: 'What the finished list looks like',
    artifactLead: 'The same record, compiled. Left is before (allow everything); right is after pod tightened it.',
    observedLabel: 'Tools actually used (7 days)',
    resultLabel: 'What pod decided',
    evidenceLabel: 'Because',
    snippetLabel: 'Written into the policy',
    unlistedSnippet: '// never used, so it is not granted',
    footnote:
      'The rules are not baked into the code. Want it stricter or looser? Change one file. Get it wrong and it fails loudly instead of quietly letting something through.',
  },
  screens: {
    title: 'What it actually looks like',
    lead: 'This is the Pod Cloud console: every agent’s permissions, calls and alerts across machines, in one place. The local console (pod ui) is the single-machine version of the same information architecture.',
    note: 'Account details in the captures have been redacted.',
    zoom: 'Open full size',
    close: 'Close',
    shots: [
      {
        src: '/shots/cloud-overview-1440.png',
        width: 1440,
        height: 1181,
        title: 'Overview',
        body: 'Cumulative audit events, agents online, unresolved alerts, and the last seven days of event trends, decision mix and alert types.',
        alt: 'The Pod Cloud overview page: 2,208 cumulative audit events, all 3 agents online, 186 unresolved alerts, with seven-day event trend and decision distribution charts below.',
      },
      {
        src: '/shots/cloud-agents-760.png',
        width: 760,
        height: 759,
        title: 'Agent assets (narrow)',
        body: 'One row per agent: platform, audit event count, last sync — plus onboarding command, quarantine and delete.',
        alt: 'The Pod Cloud agent assets page at 760px wide, listing three agents with their status, event counts and last sync times.',
        portrait: true,
      },
    ],
  },
  artifact: {
    caption: 'The permission list pod writes for this agent, derived from real usage',
    colObserved: 'Tool actually used',
    colBaseline: 'Before',
    colResult: 'What pod decided',
    colChange: 'Change',
    changeKept: 'unchanged',
    changeTightened: 'tightened',
    changeRemoved: 'removed',
    summary: '{allow} allowed · {approve} need your approval · {deny} blocked · {unlisted} never used',
    note: 'Before is “allow everything” — a permission list that was never tightened is not a permission list.',
  },
  evidence: {
    title: 'Every step leaves a record you cannot edit',
    lead: 'pod links every action into a chain. Change any link and the whole chain stops matching — and checking that does not require trusting us.',
    points: [
      { title: 'Cannot be edited', body: 'Every action joins the chain. A later change is caught immediately, and the first broken link is named.' },
      { title: 'No raw contents', body: 'The chain stores fingerprints, not payloads. Keys and private data never land in a log.' },
      { title: 'Others can verify', body: 'Export an evidence bundle; the other side runs one command and checks it themselves.' },
    ],
    chainCaption: 'One fingerprint per action, each one locking the next',
    verified: 'Chain intact — nothing was modified',
    verifying: 'Verifying…',
  },
  positioning: {
    title: 'Where it sits next to the others',
    lead: 'There are already two kinds of tool: one tells you what your agent could reach, another gives you somewhere to enforce rules. Neither writes the rules for you. pod is that missing step.',
    lanes: [
      { who: 'Built-in protections', what: 'Guard one agent', detail: 'each in its own world' },
      { who: 'MCP gateways', what: 'A place to enforce rules', detail: 'the rules are still yours to write' },
      { who: 'Scanners', what: 'Tell you what is exposed', detail: 'not what to allow' },
      { who: 'pod', what: 'Watches what it uses, writes the rules', detail: 'observe → compile → enforce → prove' },
    ],
    isLabel: 'pod is',
    isNotLabel: 'pod is not',
    rows: [
      ['Rules written for you, not by you', 'A sandbox — it does not isolate anything'],
      ['A checkpoint every call must pass', 'A replacement for your agent’s own safeguards'],
      ['Evidence you can hand to someone else', 'Content moderation, or a judge of answers'],
      ['Entirely local — data stays on your machine', 'A cloud service that needs your logs'],
    ],
  },
  limits: {
    title: 'What it cannot do',
    lead: 'Better to draw the boundary first, so you can tell whether this is for you. None of the following is covered by pod.',
    items: [
      { title: 'No isolation', body: 'It forwards in-process; it is not a sandbox. Real isolation comes from containers or platform features, and pod’s list and evidence layer on top.' },
      { title: 'Blind to agent-to-agent talk', body: 'It only sees tool calls, not what two agents say to each other.' },
      { title: 'Cannot save a fully compromised machine', body: 'If the host is owned outright, pod will not rescue you. Reduce exposure and split work across machines instead.' },
      { title: 'Does not lead with anomaly detection', body: 'Agent behaviour drifts with prompt changes, and statistical baselines produce too many false positives. Deterministic rules lead; anomalies are a side signal.' },
      { title: 'No cross-company protocols', body: 'mTLS and SPIFFE are not implemented. Work spanning two organisations is out of scope.' },
    ],
  },
  start: {
    title: 'Five minutes to get going',
    lead: 'Take a read-only look first, then decide whether it takes over. All local, no sign-up.',
    installLabel: 'Install',
    mirrorLabel: 'GitHub mirror (use this if Gitee is unreachable)',
    installMeta: 'Clones into ~/.pod/src and puts the pod command in ~/.local/bin. Needs Node.js 22 or newer, plus git.',
    stepsLabel: 'From zero to enforced',
    steps: [
      { cmd: 'pod scan', note: 'A read-only look at the current state. Changes nothing.' },
      { cmd: 'pod onboard --yes', note: 'pod takes over observation. Your existing config is backed up and reversible.' },
      { cmd: 'pod policy draft --diff <baseline>', note: 'Compiles the list from real usage and shows what got tightened.' },
      { cmd: 'pod serve --agent <name> --policy draft.json', note: 'Goes live and starts enforcing the list.' },
      { cmd: 'pod verify-audit', note: 'Checks the record for edits, and exports an evidence bundle.' },
    ],
    agentsLabel: 'Agents verified end to end',
    agentCol: 'Agent',
    transportCol: 'How it connects',
    statusCol: 'Status',
    whereLabel: 'Where to find it',
    docsLabel: 'Docs',
  },
  footer: {
    tagline: 'Give your AI agent only the access it needs.',
    note: 'Your data stays on your machine. Open source, Apache-2.0.',
    repoTitle: 'Code',
    docsTitle: 'Docs',
    legalTitle: 'License & support',
    links: {
      github: 'GitHub',
      gitee: 'Gitee mirror',
      changelog: 'Changelog',
      license: 'Apache-2.0 license',
      security: 'Security notes',
      sponsor: 'Sponsor (unlocks nothing)',
    },
    bottom: 'Every core capability works locally. Nothing is locked behind sponsorship.',
  },
}

export const COPY: Record<Locale, Copy> = { zh, en }

/* -------------------------------------------------- shared, non-localised */

export const SUPPORTED_AGENTS = [
  { agent: 'Hermes', transport: 'Streamable HTTP', status: { zh: '端到端验证', en: 'Verified end to end' } },
  { agent: 'OpenClaw', transport: 'stdio wrapper', status: { zh: '端到端验证', en: 'Verified end to end' } },
  { agent: 'Codex', transport: 'stdio wrapper + PostToolUse hook', status: { zh: '就绪', en: 'Ready' } },
  { agent: 'DSH / Claude Code / Cursor', transport: 'MCP', status: { zh: '通过 MCP 接入', en: 'Via MCP' } },
] as const

export const DOC_LINKS = [
  { href: `${REPO.github}/blob/main/docs/FEATURES.md`, label: { zh: '能力与价值', en: 'Capabilities' } },
  { href: `${REPO.github}/blob/main/docs/threat-model.md`, label: { zh: '威胁模型', en: 'Threat model' } },
  { href: `${REPO.github}/blob/main/docs/control-plane-hardening.md`, label: { zh: '控制平面加固', en: 'Control-plane hardening' } },
  { href: `${REPO.github}/blob/main/docs/deploy-cloud.md`, label: { zh: '部署云端控制台', en: 'Deploy the cloud console' } },
] as const
