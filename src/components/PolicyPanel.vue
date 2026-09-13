<script setup lang="ts">
import { computed } from 'vue'
import VerdictPill from './VerdictPill.vue'
import { CORPUS, fill } from '../lib/content'
import { compileRule, summarizeDiff } from '../lib/compiler'
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()

/*
  Not a screenshot: the real output of `compileRule()` over the demo corpus.
  Change the compiler and this table changes with it — which is the argument
  the section is making.
*/
const rows = computed(() =>
  CORPUS.map((observation) => {
    const rule = compileRule(observation)
    const label = copy.value.artifact
    const change =
      rule.verdict === 'unlisted'
        ? label.changeRemoved
        : rule.verdict === 'allow'
          ? label.changeKept
          : label.changeTightened
    return { observation, rule, change }
  }),
)

const summary = computed(() => {
  const counts = summarizeDiff(rows.value.map((row) => row.rule))
  return fill(copy.value.artifact.summary, {
    allow: rows.value.filter((r) => r.rule.verdict === 'allow').length,
    approve: rows.value.filter((r) => r.rule.verdict === 'approve').length,
    deny: rows.value.filter((r) => r.rule.verdict === 'deny').length,
    unlisted: counts.removed,
  })
})
</script>

<template>
  <figure class="panel">
    <div class="scroll">
      <table class="diff">
        <caption class="visually-hidden">{{ copy.artifact.caption }}</caption>
        <thead>
          <tr>
            <th scope="col">{{ copy.artifact.colObserved }}</th>
            <th scope="col">{{ copy.artifact.colBaseline }}</th>
            <th scope="col">{{ copy.artifact.colResult }}</th>
            <th scope="col">{{ copy.artifact.colChange }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.observation.id">
            <th scope="row">
              <span class="srv mono">{{ row.observation.server }}</span>
              <span class="tool mono">{{ row.observation.tool }}</span>
            </th>
            <td><span class="base mono">allow</span></td>
            <td><VerdictPill :verdict="row.rule.verdict" /></td>
            <td><span class="change">{{ row.change }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <figcaption class="summary">
      <span class="mono tally">{{ summary }}</span>
      <span class="note">{{ copy.artifact.note }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.panel {
  margin: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-panel);
  background: var(--surface);
  text-align: left;
  overflow: hidden;
}

.scroll {
  overflow-x: auto;
}

.diff {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}

.diff thead th {
  padding: 10px 18px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
}

.diff thead th:last-child {
  text-align: right;
}

.diff tbody tr + tr th,
.diff tbody tr + tr td {
  border-top: 1px solid var(--line);
}

.diff tbody th {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 11px 18px;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
}

.diff tbody td {
  padding: 11px 18px;
  vertical-align: middle;
}

.diff tbody td:last-child {
  text-align: right;
}

.srv {
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.tool {
  color: var(--ink);
  font-weight: 500;
}

.base {
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.change {
  color: var(--ink-2);
  font-size: var(--fs-xs);
  white-space: nowrap;
}

.summary {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 18px;
  padding: 13px 18px;
  border-top: 1px solid var(--line);
  background: var(--surface-2);
  font-size: var(--fs-xs);
}

.tally {
  color: var(--ink);
  font-weight: 500;
}

.note {
  color: var(--ink-3);
}

@media (max-width: 640px) {
  .diff thead th:nth-child(2),
  .diff tbody td:nth-child(2),
  .diff thead th:nth-child(4),
  .diff tbody td:nth-child(4) {
    display: none;
  }

  /*
    Server above tool, not beside it. Side by side, the pair sets a min-content
    width wider than the panel and the table starts scrolling sideways.
  */
  .diff thead th,
  .diff tbody th,
  .diff tbody td {
    padding: 10px 14px;
  }

  .diff tbody th {
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    white-space: normal;
  }

  .diff .tool {
    overflow-wrap: anywhere;
  }
}
</style>
