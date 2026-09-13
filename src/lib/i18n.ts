import { computed, ref, watch } from 'vue'
import { COPY, type Copy, type Locale } from './content'

const STORAGE_KEY = 'pod-site-locale'

function detect(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* Safari in private mode throws on localStorage access. */
  }
  const preferred = navigator.languages?.[0] ?? navigator.language ?? ''
  return /^zh\b/i.test(preferred) ? 'zh' : 'en'
}

const locale = ref<Locale>(detect())

/*
  The document itself has to follow the locale, not just the visible text:
  `lang` drives CJK line-breaking and screen-reader pronunciation, and the
  title/description are what a link preview or a search result shows.
*/
watch(
  locale,
  (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Storage unavailable: the choice just will not persist. */
    }
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
    document.title = COPY[next].meta.title
    const { title, description } = COPY[next].meta
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    /*
      The og: tags are what a link preview shows. Crawlers mostly do not run
      JS, so the static values in index.html are the ones that matter — these
      updates only keep the page consistent for anything that does.
    */
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', next === 'zh' ? 'zh_CN' : 'en_US')
  },
  { immediate: true },
)

export function useLocale() {
  const copy = computed<Copy>(() => COPY[locale.value])

  function setLocale(next: Locale) {
    locale.value = next
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }

  return { locale, copy, setLocale, toggleLocale }
}
