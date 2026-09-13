<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
import CompileVisual from './CompileVisual.vue'
import CopyField from './CopyField.vue'
import { INSTALL_COMMAND, REPO } from '../lib/content'
import { useLocale } from '../lib/i18n'

const { copy } = useLocale()
</script>

<template>
  <section id="top" class="hero">
    <div class="glow" aria-hidden="true"></div>

    <div class="container inner">
      <div class="copy">
        <p class="status">
          <span class="dot" aria-hidden="true"></span>
          <span v-for="(badge, i) in copy.hero.badges" :key="badge" class="badge">
            {{ badge }}<span v-if="i < copy.hero.badges.length - 1" class="sep" aria-hidden="true">·</span>
          </span>
        </p>

        <h1>
          <span class="line">{{ copy.hero.titleA }}</span>
          <span class="line line-strong">{{ copy.hero.titleB }}</span>
        </h1>

        <p class="lead hero-lead">{{ copy.hero.lead }}</p>

        <div class="cta">
          <a class="btn btn-primary" href="#start">{{ copy.hero.ctaPrimary }}</a>
          <a class="btn" :href="REPO.github" target="_blank" rel="noopener noreferrer">
            <BrandIcon name="github" /> {{ copy.hero.ctaGithub }}
          </a>
          <a class="btn" :href="REPO.gitee" target="_blank" rel="noopener noreferrer">
            <BrandIcon name="gitee" /> {{ copy.hero.ctaGitee }}
          </a>
        </div>

        <div class="install">
          <CopyField :command="INSTALL_COMMAND" />
          <p class="install-note">{{ copy.hero.installNote }}</p>
        </div>
      </div>

      <div class="visual">
        <CompileVisual />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-block: clamp(44px, 5vw, 80px) var(--section-y);
  overflow: hidden;
}

/*
  One soft cobalt halo, the reference's actual hero move, plus a slow drift so
  the top of the page has a pulse without anything moving in the reader's way.
*/
.glow {
  position: absolute;
  inset: -300px -12% auto;
  height: 980px;
  pointer-events: none;
  background:
    radial-gradient(40% 44% at 50% 46%, var(--brand-soft-2) 0%, transparent 72%),
    radial-gradient(68% 58% at 50% 40%, var(--brand-soft) 0%, transparent 76%);
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 60%, transparent 100%);
  animation: drift 26s var(--ease-out-quart) infinite alternate;
}

@keyframes drift {
  from {
    transform: translate3d(-1.5%, 0, 0) scale(1);
  }
  to {
    transform: translate3d(1.5%, 2%, 0) scale(1.06);
  }
}

.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  /*
    Without this the column sizes to fit-content, and a child that cannot wrap
    (the badge pill) makes it wider than the viewport. `.hero` clips on
    overflow, so the failure is silent: the headline just gets cut off. English
    badges are long enough to trigger it; Chinese ones are not.
  */
  width: 100%;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5px 14px;
  border: 1px solid var(--brand-line);
  border-radius: var(--r-pill);
  background: color-mix(in oklch, var(--surface) 70%, transparent);
  color: var(--ink-2);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.dot {
  width: 6px;
  height: 6px;
  margin-inline-end: 2px;
  border-radius: 50%;
  background: var(--brand);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sep {
  color: var(--ink-3);
}

h1 {
  margin-top: clamp(22px, 3vw, 34px);
  max-width: 20em;
}

.line {
  display: block;
}

/* The second line carries the claim, so it gets the ink; the first sets it up
   in a lighter tone rather than both shouting at the same volume. */
.line-strong {
  color: var(--brand-ink);
}

.hero-lead {
  margin-top: clamp(18px, 2.4vw, 26px);
  max-width: 52ch;
  text-align: center;
  font-size: clamp(1.0625rem, 1.4vw, 1.25rem);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: clamp(26px, 3vw, 34px);
}

.install {
  width: min(660px, 100%);
  margin-top: 24px;
}

.install-note {
  margin-top: 10px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.visual {
  width: min(1040px, 100%);
  margin-top: clamp(44px, 6vw, 76px);
}

/*
  Above 1200px the hero splits. Centred, the compile visual — the one piece of
  the page that shows the product working — started at 775px on a 900px
  viewport, i.e. almost entirely below the fold at the most common desktop
  size. Two columns put the claim and the proof on the same screen.

  Below this width it stays centred, which keeps the reference's composition
  where there is no room to split.
*/
@media (min-width: 1200px) {
  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
    gap: clamp(40px, 4vw, 72px);
    align-items: center;
    text-align: left;
  }

  .copy {
    align-items: flex-start;
  }

  .status {
    justify-content: flex-start;
  }

  /* A centred hero can carry 5.25rem; a half-width column cannot. */
  h1 {
    margin-top: clamp(20px, 2vw, 28px);
    max-width: 16em;
    font-size: clamp(2.6rem, 3.45vw, 3.9rem);
  }

  .hero-lead {
    margin-top: 20px;
    max-width: 44ch;
    text-align: left;
  }

  .cta {
    justify-content: flex-start;
    margin-top: 26px;
  }

  .install {
    width: 100%;
    margin-top: 22px;
  }

  .visual {
    width: 100%;
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .line-strong {
    color: var(--ink);
  }

  /*
    Three pills wrap into three stacked rows on a phone and eat ~170px of the
    first screen. Primary on its own row, the two repositories side by side.
  */
  .cta {
    display: grid;
    /* `minmax(0, 1fr)` lets the tracks shrink below the labels' min-content;
       plain `1fr` would not, and the row would push past the viewport. */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }

  .cta .btn-primary {
    grid-column: 1 / -1;
  }

  /* Button labels are nowrap everywhere else; here they need to break. */
  .cta .btn {
    padding-inline: 12px;
    white-space: normal;
    text-align: center;
  }
}
</style>
