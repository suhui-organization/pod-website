<script setup lang="ts">
import { useLocale } from '../lib/i18n'

const { locale, copy, setLocale } = useLocale()
</script>

<template>
  <div class="lang" role="group" :aria-label="copy.nav.language">
    <span class="glider" :class="{ 'is-en': locale === 'en' }" aria-hidden="true"></span>
    <button
      type="button"
      class="opt"
      :class="{ 'is-active': locale === 'zh' }"
      :aria-pressed="locale === 'zh'"
      @click="setLocale('zh')"
    >
      中文
    </button>
    <button
      type="button"
      class="opt"
      :class="{ 'is-active': locale === 'en' }"
      :aria-pressed="locale === 'en'"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface-2);
}

.glider {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: calc(50% - 2px);
  border-radius: var(--r-pill);
  background: var(--surface);
  box-shadow: 0 1px 2px oklch(0.22 0.012 265 / 0.1);
  transition: transform var(--dur) var(--ease-out-quart);
}

.glider.is-en {
  transform: translateX(100%);
}

.opt {
  position: relative;
  z-index: 1;
  min-width: 44px;
  min-height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--ink-3);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: color var(--dur) var(--ease-out-quart);
}

.opt:hover {
  color: var(--ink-2);
}

.opt.is-active {
  color: var(--ink);
  font-weight: 600;
}
</style>
