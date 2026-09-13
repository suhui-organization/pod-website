<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../lib/i18n'
import type { Shot } from '../lib/content'

const { copy } = useLocale()

const dialog = ref<HTMLDialogElement | null>(null)
const active = ref<Shot | null>(null)

/*
  A 1440px capture rendered at ~700px is unreadable, so every shot opens at
  full size. `<dialog>` + showModal() rather than a hand-rolled overlay: the
  platform already provides focus trapping, Escape-to-close and an inert
  background, and none of it needs a dependency.
*/
function open(shot: Shot) {
  active.value = shot
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

/** A click that lands on the dialog element itself is a backdrop click. */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <section id="screens" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.screens.title }}</h2>
        <div class="head-right">
          <p class="lead">{{ copy.screens.lead }}</p>
          <p class="note">{{ copy.screens.note }}</p>
        </div>
      </header>

      <div class="shots">
        <figure
          v-for="shot in copy.screens.shots"
          :key="shot.src"
          class="shot"
          :class="{ 'is-portrait': shot.portrait }"
        >
          <button type="button" class="frame" @click="open(shot)">
            <!--
              Intrinsic width/height are set so the figure reserves its space
              before the image arrives — otherwise the section jumps as the
              captures load.
            -->
            <img
              :src="shot.src"
              :alt="shot.alt"
              :width="shot.width"
              :height="shot.height"
              loading="lazy"
              decoding="async"
            />
            <span class="visually-hidden">{{ copy.screens.zoom }}</span>
          </button>
          <figcaption class="cap">
            <h3>{{ shot.title }}</h3>
            <p>{{ shot.body }}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  <dialog ref="dialog" class="lightbox" @click="onDialogClick" @close="active = null">
    <button type="button" class="lightbox-close" @click="close">
      {{ copy.screens.close }}
    </button>
    <img v-if="active" :src="active.src" :alt="active.alt" />
  </dialog>
</template>

<style scoped>
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 56px;
  padding-bottom: clamp(32px, 4vw, 48px);
}

.head-right {
  max-width: 46ch;
}

.note {
  margin-top: 10px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

/* ---------------------------------------------------------------- figures */

.shots {
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) minmax(0, 1fr);
  gap: clamp(20px, 2.5vw, 32px);
  align-items: start;
}

.shot {
  margin: 0;
}

.frame {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-panel);
  background: var(--surface);
  overflow: hidden;
  cursor: zoom-in;
  transition: border-color var(--dur) var(--ease-out-quart);
}

.frame:hover {
  border-color: var(--line-strong);
}

.frame img {
  display: block;
  width: 100%;
  height: auto;
}

.cap {
  margin-top: 14px;
  max-width: 60ch;
}

.cap h3 {
  font-size: 1rem;
  font-weight: 600;
}

.cap p {
  margin-top: 6px;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  line-height: 1.6;
}

/* ----------------------------------------------------------------- dialog */

.lightbox {
  width: fit-content;
  max-width: min(96vw, 1680px);
  max-height: 92vh;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.lightbox::backdrop {
  background: oklch(0.17 0.015 265 / 0.78);
}

.lightbox img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(96vw, 1680px);
  max-height: 92vh;
  border-radius: var(--r-card);
  background: var(--surface);
}

.lightbox-close {
  position: fixed;
  top: 20px;
  inset-inline-end: 20px;
  z-index: var(--z-toast);
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--ink);
  font-family: inherit;
  font-size: var(--fs-sm);
  font-weight: 500;
  cursor: pointer;
}

.lightbox-close:hover {
  border-color: var(--brand-line);
  color: var(--brand-ink);
}

@media (max-width: 900px) {
  .shots {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
