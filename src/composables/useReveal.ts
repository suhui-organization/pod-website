import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Opts every `[data-reveal]` element into a scroll-triggered reveal.
 *
 * The `js` class is the switch: CSS keeps revealed content fully visible until
 * this runs, so the page degrades to "no animation" rather than "no content".
 * Elements already in the viewport (the hero) fire immediately, which reads as
 * a single orchestrated page-load rather than a scroll effect.
 */
export function useReveal() {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

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

    for (const target of targets) observer.observe(target)
  })

  onBeforeUnmount(() => observer?.disconnect())
}
