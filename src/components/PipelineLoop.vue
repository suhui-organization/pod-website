<script setup lang="ts">
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()
</script>

<template>
  <section id="loop" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.loop.title }}</h2>
        <p class="lead">{{ copy.loop.lead }}</p>
      </header>

      <ol class="steps">
        <li
          v-for="(step, i) in copy.loop.steps"
          :key="step.name"
          class="step"
          data-reveal
          :style="{ '--reveal-delay': `${i * 70}ms` }"
        >
          <span class="n mono">{{ step.n }}</span>
          <h3 class="name mono">{{ step.name }}</h3>
          <p class="title">{{ step.title }}</p>
          <code class="cmd">{{ step.command }}</code>
          <p class="body">{{ step.body }}</p>
          <p class="out"><span class="out-label">→</span>{{ step.output }}</p>
        </li>
      </ol>
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
  max-width: 52ch;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}

/* A real sequence, so the numbers carry information the reader needs. */
.step {
  position: relative;
  padding: 28px 28px 32px 0;
}

.step + .step {
  padding-inline-start: 28px;
}

.step + .step::after {
  content: '';
  position: absolute;
  top: 28px;
  bottom: 32px;
  inset-inline-start: 0;
  width: 1px;
  background: var(--line);
}

.n {
  display: block;
  color: var(--brand-ink);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.name {
  margin-top: 14px;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.title {
  margin-top: 2px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.cmd {
  display: inline-block;
  margin-top: 16px;
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-field);
  background: var(--surface-2);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.body {
  margin-top: 16px;
  max-width: 34ch;
  color: var(--ink-2);
  font-size: var(--fs-sm);
}

.out {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 14px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.out-label {
  color: var(--brand-ink);
}

@media (max-width: 720px) {
  .step,
  .step + .step {
    padding: 24px 0 26px;
  }

  .step:first-child {
    padding-top: 24px;
  }

  .step + .step::after {
    top: 0;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: 1px;
  }
}
</style>
