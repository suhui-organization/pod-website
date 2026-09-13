import { onBeforeUnmount, ref } from 'vue'

/** Copy-to-clipboard with a graceful path for non-secure contexts. */
export function useCopy(resetAfterMs = 2000) {
  const copied = ref(false)
  let timer: number | undefined

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // navigator.clipboard is undefined on plain http:// origins, which is
      // exactly how this page gets viewed over a LAN before it is deployed.
      const scratch = document.createElement('textarea')
      scratch.value = text
      scratch.setAttribute('readonly', '')
      scratch.style.cssText = 'position:fixed;top:-1000px;opacity:0'
      document.body.appendChild(scratch)
      scratch.select()
      document.execCommand('copy')
      scratch.remove()
    }

    copied.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      copied.value = false
    }, resetAfterMs)
  }

  onBeforeUnmount(() => window.clearTimeout(timer))

  return { copied, copy }
}
