import { useEffect, useRef } from "react"

export type Params = {
  distance: number
  onChange?: (progress: number) => void
}
export function usePin(params: Params) {
  const { distance, onChange } = params
  const containerRef = useRef<any>(null)
  const wrapperRef = useRef<any>(null)
  const pinRef = useRef<any>(null)
  useEffect(() => {
    const container = containerRef.current as HTMLElement
    const wrapper = wrapperRef.current as HTMLElement
    const pin = pinRef.current as HTMLElement
    if (!container || !wrapper || !pin) return
    const containerRect = container.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()
    const pinRect = pin.getBoundingClientRect()
    const originalContainerStyleHeightValue = container.style.height
    const totalHeight = containerRect.height + distance
    const headHeight = pinRect.top - wrapperRect.top
    const pinContainerDiff = pinRect.top - containerRect.top
    container.style.height = `${totalHeight}px`
    wrapper.style.position = "sticky"
    wrapper.style.top = `${-headHeight}px`

    window.addEventListener("scroll", () => {
      const scrollDistance = document.documentElement.scrollTop
      const progress = (scrollDistance - pinContainerDiff) / distance
      if (progress >= 0 && progress <= 1) {
        onChange?.(progress)
      }
    })

    return () => {
      if (!container) return
      container.style.height = originalContainerStyleHeightValue
    }
  }, [])
  return { containerRef, pinRef, wrapperRef }
}
