"use client"
import { usePin } from "@/components/Pin"
import Image from "next/image"
import { Demo } from "./Demo"
import { TinyEmitter } from "tiny-emitter"
import { useCallback, useRef } from "react"

const emitter = new TinyEmitter()
export default function Home() {
  const { containerRef, pinRef, wrapperRef } = usePin({
    distance: 5000,
    onChange: (v) => {
      emitter.emit("change", v)
    },
  })
  const subscribe = useCallback((listener: any) => {
    emitter.on("change", listener)
    return () => {
      emitter.off("change", listener)
    }
  }, [])
  return (
    <div ref={containerRef}>
      <header>
        <nav>
          <Image src="" alt="logo" width={237} height={29} />
          <ul>
            <li>
              <a href=""></a>
            </li>
          </ul>
          <button className="btn btn-primary">Download</button>
        </nav>
      </header>
      <main ref={wrapperRef}>
        <div className="h-screen"></div>
        <div ref={pinRef}>
          <Demo subscribeProgressChange={subscribe}></Demo>
        </div>
        <div className="h-screen"></div>
      </main>
    </div>
  )
}
