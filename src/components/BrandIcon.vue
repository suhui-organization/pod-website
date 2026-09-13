<script setup lang="ts">
defineProps<{ name: 'github' | 'gitee' | 'arrow' | 'copy' | 'check' }>()
</script>

<template>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    class="icon"
  >
    <path
      v-if="name === 'github'"
      fill="currentColor"
      d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.2.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
    />
    <g v-else-if="name === 'gitee'" fill="none" stroke="currentColor" stroke-width="2.1">
      <path d="M12 3a9 9 0 1 0 8.66 6.53" stroke-linecap="round" />
      <path d="M20.4 8.2H12.4" stroke-linecap="round" />
    </g>
    <g
      v-else-if="name === 'arrow'"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </g>
    <g
      v-else-if="name === 'copy'"
      fill="none"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2.4" />
      <path d="M15 5.6A2.6 2.6 0 0 0 12.4 3H6.6A2.6 2.6 0 0 0 4 5.6v5.8A2.6 2.6 0 0 0 6.6 14" />
    </g>
    <path
      v-else
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m4.5 12.5 4.8 4.8L19.5 7"
    />
  </svg>
</template>

<style scoped>
.icon {
  display: block;
  flex: none;
}
</style>
