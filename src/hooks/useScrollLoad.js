import { useEffect, useRef, useState } from "react"

export default function useScrollLoad({ elementCount, elementHeight, top, fetchMore }) {
  const containerRef = useRef()
  const [{ topIndex, bottomIndex, topHeight, bottomHeight, topThreshold, bottomThreshold, count }, setState] = useState(
    {
      topIndex: 0,
      bottomIndex: 0,
      topHeight: 0,
      bottomHeight: 0,
      topThreshold: 0,
      bottomThreshold: 0,
      count: elementCount,
    }
  )

  useEffect(() => {
    const handler = (e) => {
      const windowHeight = window.innerHeight
      const containerHeight = containerRef.current.offsetHeight + top
      const scrollY = window.scrollY
      const maxScroll = containerHeight - windowHeight

      // if (fetchMore && maxScroll > 0 && maxScroll - scrollY < 1000) {
      //   dispatch(fetchMore())
      // }

      const bottomY = windowHeight + scrollY - top
      const topY = scrollY - top

      // don't load more on every scroll tick, only after we scroll a certain distance
      if (topY > topThreshold && bottomY < bottomThreshold && elementCount === count) return

      let bottomIndex = Math.ceil(bottomY / elementHeight)
      let topIndex = Math.floor(topY / elementHeight)
      bottomIndex = Math.min(elementCount - 1, bottomIndex + 40)
      topIndex = Math.max(0, topIndex - 30)

      setState({
        topIndex,
        bottomIndex,
        topHeight: topIndex * elementHeight,
        bottomHeight: (elementCount - bottomIndex - 1) * elementHeight,
        topThreshold: topY - 200,
        bottomThreshold: bottomY + 200,
        count: elementCount,
      })
      // console.log({ topY, bottomY, topThreshold, bottomThreshold })
    }
    document.addEventListener("scroll", handler)
    handler()
    return () => {
      document.removeEventListener("scroll", handler)
    }
  }, [elementCount, elementHeight, top, topThreshold, bottomThreshold])

  return { containerRef, topIndex, bottomIndex, topHeight, bottomHeight }
}
