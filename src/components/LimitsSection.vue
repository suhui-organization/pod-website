<script setup lang="ts">
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()
</script>

<template>
  <section id="limits" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.limits.title }}</h2>
        <p class="lead">{{ copy.limits.lead }}</p>
      </header>

      <ul class="limits">
        <li
          v-for="(limit, i) in copy.limits.items"
          :key="limit.title"
          data-reveal
          :style="{ '--reveal-delay': `${i * 50}ms` }"
        >
          <h3>{{ limit.title }}</h3>
          <p>{{ limit.body }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 64ch;
  padding-bottom: clamp(28px, 3vw, 40px);
}

.head .lead {
  margin-top: 18px;
}

/* One column, hairline rules, no markers: a list of limits should read like a
   list of limits, not like five more feature cards. */
.limits {
  max-width: 78ch;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line-strong);
}

.limits li {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.limits h3 {
  font-size: 1.0625rem;
  font-weight: 550;
}

.limits p {
  margin-top: 6px;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  line-height: 1.65;
}
</style>
