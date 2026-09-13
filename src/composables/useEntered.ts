import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * True once the element has been on screen (or immediately when motion is off).
 *
 * These effects only ever *start* something that is already rendered, so a
 * headless renderer or a JS failure leaves a complete, static page rather than
 * a blank one.
 */
export function useEntered(target: Ref<HTMLElement | null>, threshold = 0.25) {
  const entered = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const motionOff =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'

    const el = target.value
    if (motionOff || !el) {
      entered.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        entered.value = true
        observer?.disconnect()
      },
      { threshold },
    )
    observer.observe(el)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return entered
}
