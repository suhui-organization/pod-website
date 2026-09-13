<script setup lang="ts">
import { computed } from 'vue'
import VerdictPill from './VerdictPill.vue'
import { CORPUS, REPO } from '../lib/content'
import { compileRule } from '../lib/compiler'
import { useLocale } from '../lib/i18n'

const { copy, locale } = useLocale()

/*
  The wide "permission list" tile previews three real verdicts from the demo
  corpus — the same `compileRule()` the CLI models, not a drawn mock.
*/
const diffRows = computed(() =>
  CORPUS.slice(0, 3).map((observation) => ({
    observation,
    rule: compileRule(observation, locale.value),
  })),
)

/* Illustrative fingerprints for the chain tile. */
const CHAIN = ['a3f1c9', '7b2e04', 'e91d5a']
</script>

<template>
  <section id="capabilities" class="overview">
    <div class="container">
      <header class="head">
        <h2>{{ copy.overview.title }}</h2>
        <p class="lead">{{ copy.overview.lead }}</p>
      </header>

      <ul class="tiles">
        <li
          v-for="tile in copy.overview.tiles"
          :key="tile.id"
          class="tile"
          :class="{ 'is-wide': tile.wide }"
        >
          <!-- The wide tiles carry the artifact itself, not an icon. -->
          <div v-if="tile.visual === 'diff'" class="mini mini-diff" aria-hidden="true">
            <div v-for="row in diffRows" :key="row.observation.id" class="mini-row">
              <span class="mini-tool mono">{{ row.observation.tool }}</span>
              <span class="mini-was mono">allow</span>
              <span class="mini-arrow mono" aria-hidden="true">→</span>
              <VerdictPill :verdict="row.rule.verdict" />
            </div>
          </div>

          <div v-else-if="tile.visual === 'chain'" class="mini mini-chain" aria-hidden="true">
            <span v-for="(hash, i) in CHAIN" :key="hash" class="mini-hash mono">
              <span v-if="i > 0" class="mini-link"></span>
              {{ hash }}
            </span>
            <span class="mini-tick">✓</span>
          </div>

          <h3>{{ tile.title }}</h3>
          <p class="tile-body">{{ tile.body }}</p>
          <p class="tile-cmd mono">{{ tile.command }}</p>
        </li>
      </ul>

      <div class="more">
        <p class="more-label">{{ copy.overview.moreLabel }}</p>
        <p class="more-list mono">{{ copy.overview.commands }}</p>
        <p class="more-note">
          {{ copy.overview.cloudNote }}
          <a
            :href="`${REPO.github}/blob/main/docs/FEATURES.md`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ copy.overview.docsLabel }}
          </a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
  A tinted band, so the page has a beat between the white hero and the white
  sections below. It is the softest token in the palette — enough to group the
  capability set, not enough to read as a second surface.
*/
.overview {
  padding-block: var(--section-y);
  border-block: 1px solid var(--line);
  background: var(--bg-soft);
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 56px;
  padding-bottom: clamp(32px, 4vw, 48px);
}

.head .lead {
  max-width: 44ch;
}

/* ------------------------------------------------------------------ tiles */

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
  Six columns: two wide tiles (3 each) plus six plain tiles (2 each) fill
  exactly three rows. The size split is what keeps this from being the
  identical-card grid the layout guidance warns about.
*/
@media (min-width: 900px) {
  .tiles {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .tile {
    grid-column: span 2;
  }

  .tile.is-wide {
    grid-column: span 3;
  }
}

.tile {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--surface);
}

.tile h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.014em;
  text-wrap: balance;
}

.tile-body {
  margin-top: 8px;
  max-width: 44ch;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  line-height: 1.6;
}

/*
  The command is the tile's visual anchor. A developer scanning this section
  reads the commands before the prose — which is the right order for this
  audience, and it keeps the tiles off the "icon + heading + text" template.
*/
.tile-cmd {
  align-self: flex-start;
  margin-top: auto;
  padding-top: 26px;
  color: var(--ink);
  font-size: var(--fs-xs);
}

.tile-cmd::before {
  content: '';
  display: block;
  margin-top: -14px;
  margin-bottom: 14px;
  border-top: 1px solid var(--line);
}

/* --------------------------------------------------------- micro-visuals */

.mini {
  margin-bottom: 18px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-field);
  background: var(--surface-2);
  font-size: var(--fs-xs);
}

.mini-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 8px;
}

.mini-row + .mini-row {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.mini-tool {
  min-width: 0;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-was,
.mini-arrow {
  color: var(--ink-3);
}

.mini-chain {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-hash {
  position: relative;
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  letter-spacing: 0.02em;
}

.mini-link {
  position: absolute;
  top: 50%;
  left: -10px;
  width: 10px;
  height: 1px;
  background: var(--line-strong);
}

.mini-tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-inline-start: auto;
  border-radius: 50%;
  background: var(--ok);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

/* ------------------------------------------------------------------- more */

.more {
  margin-top: clamp(28px, 3vw, 40px);
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.more-label {
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.more-list {
  margin-top: 7px;
  max-width: 108ch;
  color: var(--ink-2);
  font-size: var(--fs-xs);
  line-height: 1.9;
}

.more-note {
  margin-top: 10px;
  color: var(--ink-3);
  font-size: var(--fs-sm);
}

@media (max-width: 560px) {
  .mini-diff .mini-was,
  .mini-diff .mini-arrow {
    display: none;
  }

  .mini-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .mini-chain {
    flex-wrap: wrap;
  }
}
</style>
