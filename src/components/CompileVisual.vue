<script setup lang="ts">
import { computed, ref } from 'vue'
import { compileRule, type Verdict } from '../lib/compiler'
import { HERO_CAPABILITIES, fill } from '../lib/content'
import { useLocale } from '../lib/i18n'
import { useEntered } from '../composables/useEntered'

/*
  The hero moment, and the only decorative-looking thing on the page that is
  not decoration: this is `compileRule()` running over 24 real capabilities
  from the demo week. Each chip resolves from "pending" to the verdict the
  CLI would actually emit.
*/
const { copy } = useLocale()
const root = ref<HTMLElement | null>(null)
const entered = useEntered(root, 0.2)

const chips = HERO_CAPABILITIES.map((observation) => ({
  observation,
  rule: compileRule(observation),
}))

const ORDER: Verdict[] = ['allow', 'approve', 'deny', 'unlisted']

const counts = computed(() => {
  const tally: Record<Verdict, number> = { allow: 0, approve: 0, deny: 0, unlisted: 0 }
  for (const chip of chips) tally[chip.rule.verdict] += 1
  return tally
})

const summary = computed(() => fill(copy.value.visual.summary, counts.value))
</script>

<template>
  <figure ref="root" class="cv" :class="{ 'is-resolved': entered }">
    <div class="bar">
      <span class="state">
        <span class="pulse" aria-hidden="true"></span>
        <span aria-live="polite">{{ entered ? copy.visual.done : copy.visual.scanning }}</span>
      </span>
      <span class="track" aria-hidden="true"><i></i></span>
    </div>

    <div class="stage">
      <ul class="chips">
        <li
          v-for="(chip, i) in chips"
          :key="chip.observation.id"
          class="chip"
          :class="`v-${chip.rule.verdict}`"
          :style="{ '--i': i }"
        >
          <span class="mark" aria-hidden="true"></span>
          <span class="tool mono">{{ chip.observation.tool }}</span>
          <!--
            The verdict is carried by the mark shape and the chip tint, decoded
            by the legend below; the word is still here for a screen reader.
            Printing it inside every chip starved the tool name of width and
            pushed two of the twenty-four into ellipsis.
          -->
          <span class="visually-hidden">
            {{ chip.observation.server }}.{{ chip.observation.tool }} —
            {{ entered ? chip.rule.verdict : copy.visual.pending }}
          </span>
        </li>
      </ul>
    </div>

    <div class="foot">
      <ul class="legend">
        <li v-for="verdict in ORDER" :key="verdict" class="legend-item">
          <span class="mark" :class="`m-${verdict}`" aria-hidden="true"></span>
          <span class="mono">{{ verdict }}</span>
        </li>
      </ul>
      <p class="summary mono">{{ summary }}</p>
    </div>

    <figcaption class="caption">{{ copy.visual.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.cv {
  margin: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-panel);
  background: var(--surface);
  overflow: hidden;
  text-align: left;
}

/* ---------------------------------------------------------------- toolbar */

.bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-2);
  font-size: var(--fs-xs);
}

.state {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex: none;
  color: var(--ink);
  font-weight: 500;
}

.pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand);
}

.pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid var(--brand);
  border-radius: 50%;
  animation: pulse 1.6s var(--ease-out-quart) infinite;
}

.is-resolved .pulse::after {
  animation: none;
  opacity: 0;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.7; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}

.track {
  flex: 1 1 auto;
  height: 3px;
  border-radius: 2px;
  background: var(--surface-3);
  overflow: hidden;
}

.track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.05s var(--ease-out-expo);
}

.is-resolved .track i {
  transform: scaleX(1);
}

/* ------------------------------------------------------------------ stage */

.stage {
  position: relative;
  overflow: hidden;
}

/*
  One pass of a soft band, clipped to the grid. It is the compiling gesture,
  not a looping sheen — it runs once and never comes back.
*/
.stage::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 22%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in oklch, var(--brand) 22%, transparent),
    transparent
  );
  transform: translateX(-140%);
  opacity: 0;
}

.is-resolved .stage::after {
  animation: sweep 1.5s 120ms var(--ease-out-quart) 1;
}

@keyframes sweep {
  0% { transform: translateX(-140%); opacity: 1; }
  100% { transform: translateX(520%); opacity: 1; }
}

.chips {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(132px, 100%), 1fr));
  gap: 6px;
  margin: 0;
  padding: 18px;
  list-style: none;
}

.chip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-field);
  background: var(--surface-2);
  color: var(--ink-3);
  /*
    Each chip resolves on its own beat. 24 × 26ms ≈ 620ms of stagger, inside
    the budget the motion guidance sets for list choreography.
  */
  transition:
    background-color 380ms var(--ease-out-quart),
    border-color 380ms var(--ease-out-quart),
    color 380ms var(--ease-out-quart),
    transform 380ms var(--ease-out-quart);
  transition-delay: calc(var(--i) * 26ms);
}

.mark {
  flex: none;
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
  transition: opacity 380ms var(--ease-out-quart);
  transition-delay: calc(var(--i) * 26ms);
}

.tool {
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--fs-xs);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.is-resolved .chip {
  transform: none;
}

.is-resolved .chip .mark {
  opacity: 1;
}

.is-resolved .v-allow {
  border-color: color-mix(in oklch, var(--ok) 28%, var(--line));
  background: var(--ok-soft);
  color: var(--ok);
}

.is-resolved .v-approve {
  border-color: color-mix(in oklch, var(--warn) 28%, var(--line));
  background: var(--warn-soft);
  color: var(--warn);
}

.is-resolved .v-approve .mark {
  border-radius: 1px;
}

.is-resolved .v-deny {
  border-color: color-mix(in oklch, var(--deny) 26%, var(--line));
  background: var(--deny-soft);
  color: var(--deny);
}

.is-resolved .v-deny .mark {
  border-radius: 0;
  transform: rotate(45deg);
}

/* Never observed: outlined and flat, not a fourth colour. */
.is-resolved .v-unlisted {
  border-style: dashed;
  border-color: var(--line-strong);
  background: var(--surface-2);
  color: var(--ink-3);
}

.is-resolved .v-unlisted .mark {
  width: 8px;
  height: 2px;
  border-radius: 1px;
}

/* ------------------------------------------------------------------- foot */

.foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 12px 18px;
  border-top: 1px solid var(--line);
  background: var(--surface-2);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-2);
  font-size: var(--fs-xs);
}

.legend .mark {
  opacity: 1;
  background: var(--ink-3);
}

.legend .m-allow { background: var(--ok); }
.legend .m-approve { background: var(--warn); border-radius: 1px; }
.legend .m-deny { background: var(--deny); border-radius: 0; transform: rotate(45deg); }
.legend .m-unlisted { width: 8px; height: 2px; border-radius: 1px; }

.summary {
  color: var(--ink);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.caption {
  padding: 10px 18px 14px;
  border-top: 1px solid var(--line);
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

@media (max-width: 640px) {
  .chips {
    grid-template-columns: repeat(auto-fill, minmax(min(132px, 100%), 1fr));
    gap: 5px;
    padding: 12px;
  }

  .bar,
  .foot {
    padding: 10px 14px;
  }

  .caption {
    padding: 10px 14px 14px;
  }
}
</style>
