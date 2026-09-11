const EASE = 'cubic-bezier(0.215, 0.61, 0.355, 1)'
const DURATION = 450
const RISE = 12
// Matches the load intro: the eyes land at 450ms, the content follows at 550ms.
const LOAD_DELAY = 550

const hide = (node: HTMLElement, delay: number) => {
  node.style.transition = `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`
  node.style.transitionDelay = `${delay}ms`
  node.style.opacity = '0'
  node.style.transform = `translateY(${RISE}px)`
}

const show = (node: HTMLElement) => {
  node.style.opacity = ''
  node.style.transform = ''
}

/**
 * Fades an element in once it scrolls into view. Anything already on screen at
 * mount waits for the page intro instead, so the load still reads eyes-first.
 * State lives inline, so the action needs no accompanying css, and without js
 * (or with reduced motion) the element keeps its server-rendered appearance.
 */
export const reveal = (node: HTMLElement) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const box = node.getBoundingClientRect()
  const onScreen = box.top < window.innerHeight && box.bottom > 0
  hide(node, onScreen ? LOAD_DELAY : 0)

  const observer = new IntersectionObserver(
    ([entry], self) => {
      if (!entry.isIntersecting) {
        return
      }
      self.disconnect()
      show(node)
    },
    { threshold: 0.15 }
  )

  observer.observe(node)

  return {
    destroy: () => observer.disconnect()
  }
}
