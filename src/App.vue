<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import PipelineLoop from './components/PipelineLoop.vue'
import CompilerDemo from './components/CompilerDemo.vue'
import ScreensSection from './components/ScreensSection.vue'
import EvidenceBand from './components/EvidenceBand.vue'
import CapabilityMap from './components/CapabilityMap.vue'
import PositioningSection from './components/PositioningSection.vue'
import LimitsSection from './components/LimitsSection.vue'
import StartSection from './components/StartSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useLocale } from './lib/i18n'
import { useReveal } from './composables/useReveal'

const { copy } = useLocale()

useReveal()
</script>

<template>
  <a class="skip-link" href="#main">{{ copy.nav.skip }}</a>
  <SiteNav />

  <main id="main">
    <HeroSection />
    <!--
      "What it can do" comes before "how it works". The previous order led with
      mechanism, and the capability set did not start until 4.3 screens down —
      a visitor could not tell what the tool does without scrolling past the
      whole pitch.
    -->
    <CapabilityMap />
    <PipelineLoop />
    <CompilerDemo />
    <ScreensSection />
    <EvidenceBand />
    <PositioningSection />
    <LimitsSection />
    <StartSection />
  </main>

  <SiteFooter />
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: 0;
  left: 50%;
  z-index: var(--z-toast);
  transform: translate(-50%, -140%);
  padding: 10px 18px;
  border-radius: 0 0 10px 10px;
  background: var(--brand);
  color: #fff;
  font-size: var(--fs-sm);
  font-weight: 500;
  text-decoration: none;
  transition: transform var(--dur) var(--ease-out-quart);
}

.skip-link:focus-visible {
  transform: translate(-50%, 0);
}
</style>
