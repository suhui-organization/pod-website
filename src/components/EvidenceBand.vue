<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../lib/i18n'
import { useEntered } from '../composables/useEntered'

const { copy } = useLocale()
const root = ref<HTMLElement | null>(null)
const entered = useEntered(root, 0.25)

/*
  Illustrative fingerprints, the shape the real chain writes. Not live data —
  the point of the band is the *structure*, and inventing plausible hashes is
  honest as long as they are labelled as a diagram, which the caption does.
*/
const LINKS = ['a3f1c9', '7b2e04', 'e91d5a', '04c7b3', 'd5a80e', '3f6b21']
</script>

<template>
  <section id="evidence" class="band">
    <div class="container">
      <header class="head">
        <h2>{{ copy.evidence.title }}</h2>
        <p class="lead">{{ copy.evidence.lead }}</p>
      </header>

      <figure ref="root" class="chain" :class="{ 'is-verified': entered }">
        <ol class="links">
          <li v-for="(hash, i) in LINKS" :key="hash" :style="{ '--i': i }">
            <span class="idx mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="hash mono">{{ hash }}</span>
          </li>
        </ol>

        <div class="status">
          <span class="tick" aria-hidden="true">✓</span>
          <span aria-live="polite">
            {{ entered ? copy.evidence.verified : copy.evidence.verifying }}
          </span>
        </div>

        <figcaption class="chain-caption">{{ copy.evidence.chainCaption }}</figcaption>
      </figure>

      <ul class="points">
        <li v-for="point in copy.evidence.points" :key="point.title">
          <h3>{{ point.title }}</h3>
          <p>{{ point.body }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/*
  The page's one dark beat. It is not terminal cosplay: no mono walls, no neon
  green, no all-caps. A near-black surface tinted toward the brand hue, white
  type, and the chain as a diagram. The contrast against the surrounding white
  is what gives the section its weight.
*/
.band {
  padding-block: var(--section-y);
  background: var(--dark-bg);
  color: var(--on-dark-2);
}

.head {
  max-width: 60ch;
  padding-bottom: clamp(36px, 4vw, 56px);
}

h2 {
  color: var(--on-dark);
}

.lead {
  margin-top: 18px;
  color: var(--on-dark-2);
}

/* ------------------------------------------------------------------ chain */

.chain {
  margin: 0;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(94px, 100%), 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links li {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px;
  border: 1px solid var(--dark-line);
  border-radius: var(--r-field);
  background: var(--dark-surface);
  opacity: 0.42;
  transition:
    opacity 420ms var(--ease-out-quart),
    border-color 420ms var(--ease-out-quart),
    transform 420ms var(--ease-out-quart);
  transition-delay: calc(var(--i) * 90ms);
  transform: translateY(4px);
}

.is-verified .links li {
  opacity: 1;
  transform: none;
  border-color: color-mix(in oklch, var(--brand-on-dark) 42%, var(--dark-line));
}

.idx {
  color: var(--on-dark-3);
  font-size: 10px;
}

.hash {
  color: var(--on-dark);
  font-size: var(--fs-xs);
  letter-spacing: 0.02em;
}

/* The link between blocks only reads correctly in a single row. */
@media (min-width: 861px) {
  .links {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .links li + li::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    width: 10px;
    height: 1px;
    background: var(--dark-line);
    transition: background-color 420ms var(--ease-out-quart);
    transition-delay: calc(var(--i) * 90ms);
  }

  .is-verified .links li + li::before {
    background: color-mix(in oklch, var(--brand-on-dark) 42%, var(--dark-line));
  }
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 22px;
  padding: 7px 15px 7px 11px;
  border: 1px solid var(--dark-line);
  border-radius: var(--r-pill);
  background: var(--dark-surface);
  color: var(--on-dark);
  font-size: var(--fs-sm);
  font-weight: 500;
}

.tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ok-on-dark);
  color: var(--dark-bg);
  font-size: 11px;
  font-weight: 700;
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity 300ms var(--ease-out-quart),
    transform 300ms var(--ease-out-quart);
  transition-delay: 620ms;
}

.is-verified .tick {
  opacity: 1;
  transform: none;
}

.chain-caption {
  margin-top: 12px;
  color: var(--on-dark-3);
  font-size: var(--fs-xs);
}

/* ----------------------------------------------------------------- points */

.points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: clamp(24px, 3vw, 44px);
  margin: clamp(44px, 5vw, 72px) 0 0;
  padding: 0;
  list-style: none;
}

.points li {
  padding-top: 20px;
  border-top: 1px solid var(--dark-line);
}

.points h3 {
  color: var(--on-dark);
  font-size: 1.0625rem;
  font-weight: 550;
}

.points p {
  margin-top: 8px;
  max-width: 42ch;
  color: var(--on-dark-2);
  font-size: var(--fs-sm);
  line-height: 1.65;
}
</style>
