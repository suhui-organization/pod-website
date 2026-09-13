<script setup lang="ts">
import { computed, ref } from 'vue'
import PolicyPanel from './PolicyPanel.vue'
import VerdictPill from './VerdictPill.vue'
import { CORPUS } from '../lib/content'
import { compileRule } from '../lib/compiler'
import { useLocale } from '../lib/i18n'

const { copy, locale } = useLocale()

/*
  Reactive on locale: the verdict itself is language-independent, but the
  reason and the evidence line are prose and must re-render when it switches.
*/
const rows = computed(() =>
  CORPUS.map((observation) => ({ observation, rule: compileRule(observation, locale.value) })),
)

const selectedId = ref(CORPUS[0]!.id)

const selected = computed(
  () => rows.value.find((row) => row.observation.id === selectedId.value) ?? rows.value[0]!,
)

/** The fragment `pod policy draft` would actually write for this tool. */
const snippet = computed(() => {
  const { server, tool } = selected.value.observation
  const { verdict } = selected.value.rule

  if (verdict === 'unlisted') {
    return `// ${server}.${tool}\n${copy.value.demo.unlistedSnippet}`
  }

  return JSON.stringify({ [server]: { [verdict]: [tool] } }, null, 2)
})
</script>

<template>
  <section id="demo" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.demo.title }}</h2>
        <p class="lead">{{ copy.demo.lead }}</p>
      </header>

      <div class="demo" data-reveal>
        <div class="corpus">
          <p class="col-label">{{ copy.demo.observedLabel }}</p>
          <ul class="list">
            <li v-for="row in rows" :key="row.observation.id">
              <button
                type="button"
                class="row"
                :class="{ 'is-active': row.observation.id === selectedId }"
                :aria-pressed="row.observation.id === selectedId"
                @click="selectedId = row.observation.id"
              >
                <span class="calls mono">{{ row.observation.calls }}×</span>
                <span class="ids">
                  <span class="srv mono">{{ row.observation.server }}</span>
                  <span class="tool mono">{{ row.observation.tool }}</span>
                </span>
                <VerdictPill :verdict="row.rule.verdict" />
              </button>
            </li>
          </ul>
        </div>

        <div class="detail" aria-live="polite">
          <p class="col-label">{{ copy.demo.resultLabel }}</p>

          <p class="verdict-line">
            <VerdictPill :verdict="selected.rule.verdict" />
            <span class="ids mono">
              {{ selected.observation.server }}.{{ selected.observation.tool }}
            </span>
          </p>

          <p class="reason">{{ selected.rule.reason }}</p>

          <!-- Every verdict names the observation behind it. -->
          <p class="evidence">
            <span class="label">{{ copy.demo.evidenceLabel }}</span>
            <span class="mono">{{ selected.rule.evidence }}</span>
          </p>

          <div class="snippet">
            <p class="snippet-label">{{ copy.demo.snippetLabel }}</p>
            <pre class="mono">{{ snippet }}</pre>
          </div>
        </div>
      </div>

      <div class="artifact" data-reveal>
        <h3>{{ copy.demo.artifactTitle }}</h3>
        <p class="artifact-lead">{{ copy.demo.artifactLead }}</p>
        <PolicyPanel />
      </div>

      <p class="footnote">{{ copy.demo.footnote }}</p>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 48px;
  padding-bottom: clamp(36px, 4vw, 56px);
}

.head .lead {
  max-width: 50ch;
}

.demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-panel);
  background: var(--surface);
  overflow: hidden;
}

.corpus {
  padding: 20px 8px 20px 20px;
  border-inline-end: 1px solid var(--line);
  background: var(--surface-2);
}

.detail {
  padding: 20px 24px 24px;
}

.col-label {
  margin-bottom: 12px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: var(--r-field);
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) var(--ease-out-quart),
    border-color var(--dur-fast) var(--ease-out-quart);
}

.row:hover {
  border-color: var(--line);
  background: var(--surface);
}

.row.is-active {
  border-color: var(--brand-line);
  background: var(--surface);
}

.calls {
  flex: none;
  width: 42px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
}

.ids {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.srv {
  flex: none;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.tool {
  color: var(--ink);
  font-size: var(--fs-xs);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verdict-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.verdict-line .ids {
  color: var(--ink);
  font-size: var(--fs-sm);
}

.reason {
  margin-top: 18px;
  color: var(--ink);
  font-size: 1.0625rem;
  line-height: 1.6;
  text-wrap: pretty;
}

.evidence {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--ink-2);
  font-size: var(--fs-xs);
}

.label {
  flex: none;
  padding: 1px 7px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  color: var(--ink-3);
}

.snippet {
  margin-top: 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--surface-2);
  overflow: hidden;
}

.snippet-label {
  padding: 8px 14px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.snippet pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: 1.7;
}

.artifact {
  margin-top: clamp(44px, 5vw, 72px);
}

.artifact h3 {
  font-size: 1.25rem;
}

.artifact-lead {
  margin: 8px 0 20px;
  max-width: 62ch;
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.footnote {
  margin-top: 20px;
  max-width: 74ch;
  color: var(--ink-3);
  font-size: var(--fs-sm);
}

/*
  Two columns only once each column can hold the longest identifier without
  ellipsis. Below ~1040px the corpus column is too narrow for
  `create_pull_request`, and a truncated tool name is worse than a taller
  section.
*/
@media (max-width: 1040px) {
  .demo {
    grid-template-columns: minmax(0, 1fr);
  }

  .corpus {
    padding: 20px;
    border-inline-end: 0;
    border-bottom: 1px solid var(--line);
  }

  .detail {
    padding: 20px;
  }
}

/*
  Under ~560px one flex line cannot hold the call count, the identifier and the
  verdict without truncating the identifier — and the identifier is the one
  thing on the row that has to survive intact. Stack it onto two lines.
*/
@media (max-width: 560px) {
  .row {
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .ids {
    flex: 1 1 100%;
    order: 1;
  }

  .calls {
    order: 2;
  }

  .row .verdict {
    order: 3;
    margin-inline-start: auto;
  }

  /*
    Six pixels was all that separated the longest identifier from the ellipsis
    at 320px, so let it wrap instead. A second line costs height; a clipped
    tool name costs the reader the one string the row exists to show.
  */
  .tool {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
