<script setup lang="ts">
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()
</script>

<template>
  <section id="positioning" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.positioning.title }}</h2>
        <p class="lead">{{ copy.positioning.lead }}</p>
      </header>

      <ol class="lanes">
        <li
          v-for="(lane, i) in copy.positioning.lanes"
          :key="lane.who"
          class="lane"
          :class="{ 'is-pod': i === copy.positioning.lanes.length - 1 }"
        >
          <span class="who">{{ lane.who }}</span>
          <span class="what">{{ lane.what }}</span>
          <span class="detail">{{ lane.detail }}</span>
        </li>
      </ol>

      <div class="compare">
        <div class="col col-strong">
          <h3 class="col-head">{{ copy.positioning.isLabel }}</h3>
          <ul>
            <li v-for="[is] in copy.positioning.rows" :key="is">{{ is }}</li>
          </ul>
        </div>
        <div class="col">
          <h3 class="col-head muted">{{ copy.positioning.isNotLabel }}</h3>
          <ul>
            <li v-for="[, isNot] in copy.positioning.rows" :key="isNot">{{ isNot }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 62ch;
  padding-bottom: clamp(36px, 4vw, 56px);
}

.head .lead {
  margin-top: 18px;
}

.lanes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}

.lane {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 22px 24px 24px 0;
  border-bottom: 1px solid var(--line);
}

.lane + .lane {
  padding-inline-start: 24px;
}

.who {
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.what {
  color: var(--ink);
  font-size: 1.0625rem;
  font-weight: 550;
  letter-spacing: -0.012em;
  text-wrap: balance;
}

.detail {
  color: var(--ink-2);
  font-size: var(--fs-xs);
}

/* The one lane this page is about, marked by ink and weight rather than a bar. */
.lane.is-pod {
  background: var(--brand-soft);
}

.lane.is-pod .who {
  color: var(--brand-ink);
  font-weight: 600;
}

.lane.is-pod .what {
  color: var(--brand-ink);
}

.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(28px, 4vw, 64px);
  margin-top: clamp(40px, 5vw, 72px);
}

.col-head {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-strong);
  color: var(--ink);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.col-head.muted {
  color: var(--ink-3);
}

.col ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.col li {
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink-2);
  font-size: var(--fs-sm);
  line-height: 1.55;
}

.col-strong li {
  color: var(--ink);
}

@media (max-width: 640px) {
  .lane,
  .lane + .lane {
    padding: 18px 16px;
  }
}
</style>
