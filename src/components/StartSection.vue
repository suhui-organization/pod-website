<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
import CopyField from './CopyField.vue'
import {
  DOC_LINKS,
  INSTALL_COMMAND,
  INSTALL_MIRROR,
  REPO,
  SUPPORTED_AGENTS,
} from '../lib/content'
import { useLocale } from '../lib/i18n'

const { copy, locale } = useLocale()
</script>

<template>
  <section id="start" class="section rule">
    <div class="container">
      <header class="head">
        <h2>{{ copy.start.title }}</h2>
        <p class="lead">{{ copy.start.lead }}</p>
      </header>

      <div class="grid">
        <div class="install-col">
          <h3>{{ copy.start.installLabel }}</h3>
          <CopyField :command="INSTALL_COMMAND" />
          <p class="meta">{{ copy.start.installMeta }}</p>
          <p class="meta mirror-label">{{ copy.start.mirrorLabel }}</p>
          <CopyField :command="INSTALL_MIRROR" />
        </div>

        <!-- A shell transcript, not a numbered list: it reads the way the work
             actually happens, one command at a time. -->
        <div class="steps-col">
          <h3>{{ copy.start.stepsLabel }}</h3>
          <ol class="transcript">
            <li v-for="step in copy.start.steps" :key="step.cmd">
              <code class="line"><span class="prompt" aria-hidden="true">$</span>{{ step.cmd }}</code>
              <p class="note">{{ step.note }}</p>
            </li>
          </ol>
        </div>
      </div>

      <div class="agents">
        <h3>{{ copy.start.agentsLabel }}</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ copy.start.agentCol }}</th>
              <th scope="col">{{ copy.start.transportCol }}</th>
              <th scope="col">{{ copy.start.statusCol }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in SUPPORTED_AGENTS" :key="agent.agent">
              <th scope="row">{{ agent.agent }}</th>
              <td class="mono">{{ agent.transport }}</td>
              <td>{{ agent.status[locale] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="where">
        <h3>{{ copy.start.whereLabel }}</h3>
        <ul class="repos">
          <li>
            <a :href="REPO.github" target="_blank" rel="noopener noreferrer">
              <BrandIcon name="github" />
              <span class="repo-name">GitHub</span>
              <span class="repo-url mono">github.com/suhui-organization/pod</span>
              <BrandIcon name="arrow" class="repo-arrow" />
            </a>
          </li>
          <li>
            <a :href="REPO.gitee" target="_blank" rel="noopener noreferrer">
              <BrandIcon name="gitee" />
              <span class="repo-name">Gitee</span>
              <span class="repo-url mono">gitee.com/suhuisoftwares/pod</span>
              <BrandIcon name="arrow" class="repo-arrow" />
            </a>
          </li>
        </ul>

        <ul class="docs">
          <li v-for="doc in DOC_LINKS" :key="doc.href">
            <a :href="doc.href" target="_blank" rel="noopener noreferrer">
              {{ doc.label[locale] }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 58ch;
  padding-bottom: clamp(36px, 4vw, 56px);
}

.head .lead {
  margin-top: 18px;
}

.grid {
  display: grid;
  /*
    `min(320px, 100%)` keeps the track from exceeding a narrow container. A
    bare `minmax(320px, 1fr)` sets a 320px floor that overflows any viewport
    below ~360px and pushes the whole document sideways.
  */
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: clamp(32px, 4vw, 64px);
}

.install-col h3,
.steps-col h3,
.agents h3,
.where h3 {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-strong);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.meta {
  margin-top: 14px;
  color: var(--ink-3);
  font-size: var(--fs-xs);
  line-height: 1.7;
}

.mirror-label {
  margin-bottom: 10px;
}

.transcript {
  margin: 0;
  padding: 0;
  list-style: none;
}

.transcript li {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.line {
  display: block;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.prompt {
  margin-inline-end: 8px;
  color: var(--brand-ink);
  user-select: none;
}

.note {
  margin-top: 3px;
  color: var(--ink-2);
  font-size: var(--fs-sm);
  line-height: 1.6;
}

.agents {
  margin-top: clamp(44px, 5vw, 72px);
}

.table {
  width: 100%;
  margin-top: 4px;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}

.table th,
.table td {
  padding: 13px 16px 13px 0;
  border-bottom: 1px solid var(--line);
  text-align: left;
  vertical-align: baseline;
}

.table thead th {
  color: var(--ink-3);
  font-size: var(--fs-xs);
  font-weight: 500;
}

.table tbody th {
  color: var(--ink);
  font-weight: 500;
}

.table tbody td {
  color: var(--ink-2);
}

.where {
  margin-top: clamp(44px, 5vw, 72px);
}

.repos {
  margin: 0;
  padding: 0;
  list-style: none;
}

.repos a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 4px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease-out-quart);
}

.repos a:hover {
  background: var(--surface-2);
}

.repo-name {
  font-size: var(--fs-sm);
  font-weight: 550;
}

.repo-url {
  color: var(--ink-3);
  font-size: var(--fs-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repo-arrow {
  margin-inline-start: auto;
  color: var(--ink-3);
}

.repos a:hover .repo-arrow {
  color: var(--brand-ink);
}

.docs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.docs a {
  font-size: var(--fs-sm);
}

@media (max-width: 560px) {
  .repo-url {
    display: none;
  }
}
</style>
