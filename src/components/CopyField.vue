<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
import { useCopy } from '../composables/useCopy'
import { useLocale } from '../lib/i18n'

const props = defineProps<{ command: string; label?: string }>()

const { copied, copy: copyCommand } = useCopy()
const { copy } = useLocale()
</script>

<template>
  <div class="field">
    <span class="prompt mono" aria-hidden="true">$</span>
    <code class="cmd">{{ props.command }}</code>
    <button class="copy" type="button" @click="copyCommand(props.command)">
      <BrandIcon :name="copied ? 'check' : 'copy'" />
      <span aria-live="polite">{{ copied ? copy.common.copied : copy.common.copy }}</span>
    </button>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--surface-2);
}

.prompt {
  color: var(--ink-3);
  font-size: var(--fs-xs);
  user-select: none;
}

/*
  The command wraps rather than scrolling: a copy field exists to be read and
  copied, and a half-visible command at 375px serves neither.
*/
.cmd {
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: 1.6;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--ink);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease-out-quart),
    background-color var(--dur) var(--ease-out-quart);
}

.copy:hover {
  border-color: var(--brand-line);
  background: var(--brand-soft);
  color: var(--brand-ink);
}

@media (max-width: 560px) {
  .field {
    flex-wrap: wrap;
  }

  .cmd {
    flex-basis: calc(100% - 24px);
  }

  .copy {
    width: 100%;
    justify-content: center;
  }
}
</style>
