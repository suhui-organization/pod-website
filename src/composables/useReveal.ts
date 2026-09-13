import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Opts every `[data-reveal]` element into a scroll-triggered reveal.
 *
 * The `js` class is the switch: CSS keeps revealed content fully visible until
 * this runs, so the page degrades to "no animation" rather than "no content".
 * Elements already in the viewport (the hero) fire immediately, which reads as
 * a single orchestrated page-load rather than a scroll effect.
 *
 * The MutationObserver is load-bearing, not a nicety. A list rendered with
 * `:key` on a value that changes with the locale gets destroyed and re-created
 * on every language switch — and a re-created `[data-reveal]` node is one this
 * observer has never seen. Without the re-scan those nodes sat at `opacity: 0`
 * forever: switching to English blanked the whole "what it cannot do" section.
 */
export function useReveal() {
  let observer: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined

  const reveal = (el: HTMLElement) => {
    if (el.classList.contains('is-visible')) return
    observer?.observe(el)
  }

  const revealAll = (root: ParentNode) => {
    for (const el of root.querySelectorAll<HTMLElement>('[data-reveal]')) reveal(el)
  }

  onMounted(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    document.documentElement.classList.add('js')

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )

    revealAll(document)

    mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.hasAttribute('data-reveal')) reveal(node)
          revealAll(node)
        }
      }
    })
    mutations.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    mutations?.disconnect()
  })
}
