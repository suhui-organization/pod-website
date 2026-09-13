<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BrandIcon from './BrandIcon.vue'
import LanguageToggle from './LanguageToggle.vue'
import PodMark from './PodMark.vue'
import { REPO } from '../lib/content'
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()

const stuck = ref(false)
const menuOpen = ref(false)

function onScroll() {
  stuck.value = window.scrollY > 8
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="nav" :class="{ 'is-stuck': stuck }">
    <div class="container nav-inner">
      <a class="brand" href="#top" aria-label="pod">
        <PodMark :size="26" />
        <span class="brand-word">pod</span>
      </a>

      <nav v-if="copy.nav.links.length" class="links">
        <a v-for="link in copy.nav.links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>

      <div class="actions">
        <a
          class="icon-link"
          :href="REPO.github"
          target="_blank"
          rel="noopener noreferrer"
          :title="copy.nav.githubTitle"
        >
          <BrandIcon name="github" />
          <span class="visually-hidden">{{ copy.nav.githubTitle }}</span>
        </a>
        <a
          class="icon-link"
          :href="REPO.gitee"
          target="_blank"
          rel="noopener noreferrer"
          :title="copy.nav.giteeTitle"
        >
          <BrandIcon name="gitee" />
          <span class="visually-hidden">{{ copy.nav.giteeTitle }}</span>
        </a>

        <LanguageToggle />

        <a class="btn btn-primary btn-sm cta" href="#start">{{ copy.nav.install }}</a>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="nav-panel"
          @click="menuOpen = !menuOpen"
        >
          <span class="visually-hidden">
            {{ menuOpen ? copy.nav.closeMenu : copy.nav.openMenu }}
          </span>
          <span class="bars" :class="{ 'is-open': menuOpen }" aria-hidden="true">
            <i></i><i></i>
          </span>
        </button>
      </div>
    </div>

    <div v-show="menuOpen" id="nav-panel" class="panel">
      <nav class="panel-links">
        <a
          v-for="link in copy.nav.links"
          :key="link.href"
          :href="link.href"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="panel-repos">
        <a :href="REPO.github" target="_blank" rel="noopener noreferrer">
          <BrandIcon name="github" /> GitHub
        </a>
        <a :href="REPO.gitee" target="_blank" rel="noopener noreferrer">
          <BrandIcon name="gitee" /> Gitee
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  border-bottom: 1px solid transparent;
  background: color-mix(in oklch, var(--bg) 88%, transparent);
  transition:
    border-color var(--dur) var(--ease-out-quart),
    backdrop-filter var(--dur) var(--ease-out-quart);
}

.nav.is-stuck {
  border-bottom-color: var(--line);
  backdrop-filter: saturate(1.6) blur(14px);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 68px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--brand);
  text-decoration: none;
}

.brand-word {
  color: var(--ink);
  font-size: 1.1875rem;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-inline-start: 8px;
}

.links a {
  padding: 7px 12px;
  border-radius: var(--r-pill);
  color: var(--ink-2);
  font-size: var(--fs-sm);
  font-weight: 450;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease-out-quart),
    color var(--dur-fast) var(--ease-out-quart);
}

.links a:hover {
  background: var(--surface-2);
  color: var(--ink);
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-inline-start: auto;
}

.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--ink-2);
  text-decoration: none;
  transition:
    background-color var(--dur-fast) var(--ease-out-quart),
    color var(--dur-fast) var(--ease-out-quart);
}

.icon-link:hover {
  background: var(--surface-2);
  color: var(--ink);
}

.cta {
  margin-inline-start: 4px;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--surface);
  cursor: pointer;
}

.bars {
  position: relative;
  display: block;
  width: 16px;
  height: 12px;
}

.bars i {
  position: absolute;
  left: 0;
  width: 16px;
  height: 1.5px;
  border-radius: 1px;
  background: var(--ink);
  transition: transform var(--dur) var(--ease-out-quart);
}

.bars i:first-child {
  top: 2px;
}

.bars i:last-child {
  bottom: 2px;
}

.bars.is-open i:first-child {
  transform: translateY(3.25px) rotate(45deg);
}

.bars.is-open i:last-child {
  transform: translateY(-3.25px) rotate(-45deg);
}

.panel {
  display: none;
  flex-direction: column;
  padding: 8px var(--gutter) 24px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.panel-links {
  display: flex;
  flex-direction: column;
}

.panel-links a {
  padding: 14px 4px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 1.0625rem;
  text-decoration: none;
}

.panel-repos {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.panel-repos a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  min-height: 44px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  color: var(--ink);
  font-size: var(--fs-sm);
  text-decoration: none;
}

@media (max-width: 1100px) {
  .links,
  .icon-link {
    display: none;
  }

  .menu-toggle,
  .panel {
    display: flex;
  }
}

@media (max-width: 560px) {
  .cta {
    display: none;
  }

  .nav-inner {
    gap: 10px;
  }
}
</style>
