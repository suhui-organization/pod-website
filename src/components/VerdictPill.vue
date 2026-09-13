<script setup lang="ts">
import type { Verdict } from '../lib/compiler'

defineProps<{ verdict: Verdict }>()
</script>

<!--
  The verdict always ships as a word, never as a colour alone — that is pod's
  own accessibility rule for the three-state decision, kept here on the
  marketing surface because the vocabulary is the product's, not the page's.
-->
<template>
  <span class="verdict" :class="`verdict-${verdict}`">{{ verdict }}</span>
</template>
