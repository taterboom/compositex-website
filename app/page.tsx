"use client"
import { usePin } from "@/components/Pin"
import Image from "next/image"
import { Demo } from "./Demo"
import { TinyEmitter } from "tiny-emitter"
import { useCallback, useRef } from "react"
import Examples from "./Examples"

const emitter = new TinyEmitter()
export default function Home() {
  const { containerRef, pinRef, wrapperRef } = usePin({
    distance: 500,
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
      <main ref={wrapperRef} className="mb-6">
        <div className="compositex-hero">
          <div className="compositex-hero-content">
            <h3 className="text-4xl leading-snug font-semibold">
              Powerful browser extension for easy script management with pipelines composed by
              middleware-like nodes.
            </h3>
            <div className="flex mt-8 gap-4">
              <button className="btn btn-primary">Getting Started</button>
              <button className="btn btn-primary">Free Install</button>
            </div>
          </div>
        </div>
        <div ref={pinRef}>
          <Demo subscribeProgressChange={subscribe}></Demo>
        </div>
        <Examples />
        <div className="divider"></div>
        <footer className="footer items-center p-4 justify-center gap-16 rounded-xl mb-4">
          <div className="items-center grid-flow-col">
            <Image src="/images/compositex-web-logo.png" alt="logo" width={130} height={16} />
          </div>
          <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
