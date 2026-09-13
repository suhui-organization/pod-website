/**
 * pod — the least-privilege compilation step, as the landing page shows it.
 *
 * The real compiler is `pod policy draft` (packages/core). This module is the
 * page's interactive demo, but it keeps the same contract the CLI documents:
 * a verdict is never invented, it is derived from an observation, and it can
 * always be traced back to the call that produced it.
 *
 * "Evidence first, conclusion second" is what separates pod from a dashboard
 * that prints a score with no source. Every branch below must be able to name
 * the observation it came from.
 */

import type { Locale } from './content'

/** The three-state decision vocabulary, plus "we never saw this at all". */
export type Verdict = 'allow' | 'approve' | 'deny' | 'unlisted'

export interface Observation {
  id: string
  server: string
  tool: string
  /** How many times the gateway recorded this call over the recording window. */
  calls: number
  /** The worst thing this tool can do, read from its declared schema. */
  effect: 'read' | 'write' | 'exec' | 'destroy'
  /** Recorded calls whose arguments or output touched a sensitive path or secret. */
  sensitiveHits: number
  /** Hosts seen in arguments, for tools that reach the network. */
  hosts: string[]
}

export interface CompiledRule {
  verdict: Verdict
  /** One sentence a human can audit without re-reading the corpus. */
  reason: string
  /** Where the verdict came from — the specific observation behind it. */
  evidence: string
}

/**
 * Turn one observed tool into the rule `pod policy draft` would emit.
 *
 * Contract: this function must be total — every observation gets a verdict,
 * and anything it cannot reason about must land on the restrictive side. The
 * gateway is fail-closed, so a compiler that guesses generously is the one
 * place where a bug becomes a breach.
 *
 * TODO(walden) — the skeleton below is the conservative reading of the docs,
 * and it works. What it does not yet encode is that five of its thresholds are
 * policy calls rather than implementation details, and those are the product.
 * They are yours to set:
 *
 *   1. `sensitiveHits > 0` locks a tool down permanently. Should one `.env`
 *      read, weeks ago, outrank a thousand clean calls since? Alternatives:
 *      gate on a rate (hits / calls), or decay the hit by recency.
 *   2. `effect === 'write'` → approve treats a write to `./notes.md` exactly
 *      like a write to `~/.zshrc`. Narrow it by path scope, or stay blunt?
 *   3. `effect === 'exec'` → approve. Exec is the widest capability there is;
 *      `deny` plus a JIT grant is the other defensible answer.
 *   4. `calls === 0` → unlisted, i.e. dropped. This is "don't grant what you
 *      did not observe". The alternative is to keep it as `deny` so it stays in
 *      the policy and makes noise the moment something tries it.
 *   5. `effect === 'read'` → allow. Reads are the largest category, so this is
 *      where an over-broad allow quietly widens the whole surface.
 *
 * Whatever you pick, keep the invariant: a verdict without `evidence` is a bug,
 * and unknown input falls to the restrictive side.
 */
/** Verdict wording, in both languages, so the page can switch without the
 *  compiler losing its voice. The verdict words themselves stay English. */
interface Phrasing {
  neverUsed: { reason: string; evidence: (call: string) => string }
  sensitive: { reason: string; evidence: (call: string, hits: number, calls: number) => string }
  destructive: { reason: string; evidence: (call: string) => string }
  mutating: {
    reason: string
    evidence: (call: string, effect: string, hosts: string[]) => string
  }
  readOnly: { reason: string; evidence: (call: string, calls: number) => string }
}

const PHRASING: Record<Locale, Phrasing> = {
  zh: {
    neverUsed: {
      reason: '录制窗口内从未被调用，不进入策略——没观察到就不授予。',
      evidence: (call) => `${call} 在语料中出现 0 次`,
    },
    sensitive: {
      reason: '参数或输出命中过敏感路径 / 密钥，一旦观察过就永久收紧。',
      evidence: (call, hits, calls) => `${call} 的 ${calls} 次调用中有 ${hits} 次触达敏感目标`,
    },
    destructive: {
      reason: '具备破坏性能力，默认拒绝；需要时用 JIT 授权临时开口。',
      evidence: (call) => `${call} 的 schema 声明了破坏性操作`,
    },
    mutating: {
      reason: '会改变状态或执行命令，挂起等人批；超时按拒绝处理。',
      evidence: (call, effect, hosts) =>
        `${call} 被观察为 ${effect} 能力${hosts.length ? `，出网目标：${hosts.join('、')}` : ''}`,
    },
    readOnly: {
      reason: '只读且未触达敏感目标，放行不影响工作流。',
      evidence: (call, calls) => `${call} 在 ${calls} 次调用中均为只读`,
    },
  },
  en: {
    neverUsed: {
      reason: 'It was never called during the recording window, so it is not granted.',
      evidence: (call) => `${call} appears 0 times in the record`,
    },
    sensitive: {
      reason:
        'Its arguments or output once reached a sensitive path or a key, so it stays locked down.',
      evidence: (call, hits, calls) => `${hits} of ${call}’s ${calls} calls reached something sensitive`,
    },
    destructive: {
      reason:
        'It can destroy things, so it is denied by default. Open it briefly with a time-boxed grant when you must.',
      evidence: (call) => `${call} declares a destructive operation`,
    },
    mutating: {
      reason:
        'It changes state or runs commands, so it waits for your approval. A timeout counts as a no.',
      evidence: (call, effect, hosts) =>
        `${call} behaves as ${effect}${hosts.length ? `, reaching ${hosts.join(', ')}` : ''}`,
    },
    readOnly: {
      reason:
        'Read-only, and it never touched anything sensitive. Allowing it does not get in your way.',
      evidence: (_call, calls) => `All ${calls} recorded calls were read-only`,
    },
  },
}

export function compileRule(observation: Observation, locale: Locale = 'zh'): CompiledRule {
  const { server, tool, calls, effect, sensitiveHits, hosts } = observation
  const call = `${server}.${tool}`
  const text = PHRASING[locale]

  // Never observed → nothing to grant. Least privilege means not granting a
  // capability merely because the tool could have been called.
  if (calls === 0) {
    return { verdict: 'unlisted', reason: text.neverUsed.reason, evidence: text.neverUsed.evidence(call) }
  }

  // One observed sensitive touch outranks any volume of clean traffic.
  // This is the branch the README calls out: observation beats guessing.
  if (sensitiveHits > 0) {
    return {
      verdict: 'deny',
      reason: text.sensitive.reason,
      evidence: text.sensitive.evidence(call, sensitiveHits, calls),
    }
  }

  if (effect === 'destroy') {
    return {
      verdict: 'deny',
      reason: text.destructive.reason,
      evidence: text.destructive.evidence(call),
    }
  }

  if (effect === 'write' || effect === 'exec') {
    return {
      verdict: 'approve',
      reason: text.mutating.reason,
      evidence: text.mutating.evidence(call, effect, hosts),
    }
  }

  return {
    verdict: 'allow',
    reason: text.readOnly.reason,
    evidence: text.readOnly.evidence(call, calls),
  }
}

export interface DiffSummary {
  tightened: number
  removed: number
}

/** Counts against the permissive baseline every new install starts from. */
export function summarizeDiff(rules: CompiledRule[]): DiffSummary {
  return rules.reduce<DiffSummary>(
    (acc, rule) => {
      if (rule.verdict === 'unlisted') acc.removed += 1
      else if (rule.verdict !== 'allow') acc.tightened += 1
      return acc
    },
    { tightened: 0, removed: 0 },
  )
}
