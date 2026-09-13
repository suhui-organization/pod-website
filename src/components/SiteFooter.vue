<script setup lang="ts">
import PodMark from './PodMark.vue'
import { DOC_LINKS, REPO } from '../lib/content'
import { useLocale } from '../lib/i18n'

const { copy, locale } = useLocale()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="top">
        <div class="identity">
          <a class="brand" href="#top">
            <PodMark :size="24" />
            <span class="word">pod</span>
          </a>
          <p class="tagline">{{ copy.footer.tagline }}</p>
          <p class="note">{{ copy.footer.note }}</p>
        </div>

        <nav class="cols">
          <div class="col">
            <h2>{{ copy.footer.repoTitle }}</h2>
            <ul>
              <li>
                <a :href="REPO.github" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.github }}
                </a>
              </li>
              <li>
                <a :href="REPO.gitee" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.gitee }}
                </a>
              </li>
              <li>
                <a :href="`${REPO.github}/blob/main/CHANGELOG.md`" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.changelog }}
                </a>
              </li>
            </ul>
          </div>

          <div class="col">
            <h2>{{ copy.footer.docsTitle }}</h2>
            <ul>
              <li v-for="doc in DOC_LINKS" :key="doc.href">
                <a :href="doc.href" target="_blank" rel="noopener noreferrer">
                  {{ doc.label[locale] }}
                </a>
              </li>
            </ul>
          </div>

          <div class="col">
            <h2>{{ copy.footer.legalTitle }}</h2>
            <ul>
              <li>
                <a :href="`${REPO.github}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.license }}
                </a>
              </li>
              <li>
                <a :href="`${REPO.github}/blob/main/SECURITY.md`" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.security }}
                </a>
              </li>
              <li>
                <a :href="REPO.sponsor" target="_blank" rel="noopener noreferrer">
                  {{ copy.footer.links.sponsor }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="bottom">
        <p>{{ copy.footer.bottom }}</p>
        <p class="mono">{{ REPO.version }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: clamp(48px, 6vw, 80px) 40px;
  border-top: 1px solid var(--line);
}

.top {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 2fr);
  gap: clamp(32px, 5vw, 72px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--brand);
  text-decoration: none;
}

.word {
  color: var(--ink);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.tagline {
  margin-top: 16px;
  max-width: 32ch;
  color: var(--ink);
  font-size: var(--fs-sm);
}

.note {
  margin-top: 6px;
  max-width: 34ch;
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

.cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  gap: 28px;
}

.col h2 {
  margin-bottom: 12px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.col ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.col li + li {
  margin-top: 9px;
}

.col a {
  color: var(--ink-2);
  font-size: var(--fs-sm);
  text-decoration: none;
}

.col a:hover {
  color: var(--brand-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-top: clamp(40px, 5vw, 64px);
  padding-top: 20px;
  border-top: 1px solid var(--line);
  color: var(--ink-3);
  font-size: var(--fs-xs);
}

@media (max-width: 720px) {
  .top {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
