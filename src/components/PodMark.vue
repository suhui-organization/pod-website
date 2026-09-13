<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 26 })
</script>

<!--
  The mark reads as a narrowing funnel: three stacked bars, each shorter than
  the last. That is literally what the product does — it compiles a wide
  surface of possible calls down to the few that are actually granted.
-->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
    class="mark"
  >
    <rect width="32" height="32" rx="8.5" fill="currentColor" />
    <rect x="7.5" y="8.6" width="17" height="3.4" rx="1.7" fill="#fff" />
    <rect x="7.5" y="14.3" width="11.4" height="3.4" rx="1.7" fill="#fff" opacity="0.74" />
    <rect x="7.5" y="20" width="6.4" height="3.4" rx="1.7" fill="#fff" opacity="0.46" />
  </svg>
</template>

<style scoped>
.mark {
  display: block;
  flex: none;
}
</style>
