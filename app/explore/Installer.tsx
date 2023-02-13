"use client"

import { MaterialSymbolsDownloadRounded } from "@/components/icons"
import { BundledPipeline, MetaNode } from "@/type"
import clsx from "classnames"

declare global {
  interface Window {
    __compositex_proxy__: {
      install(objects: MetaNode | BundledPipeline | Array<MetaNode | BundledPipeline>): void
    }
  }
}

export default function Installer(props: { value: any }) {
  return (
    <button
      className={clsx("btn")}
      onClick={() => {
        // window.__xxx__.install()
        // cs: create options.html
        // cs: tab.sendmessage
        if (window.__compositex_proxy__) {
          window.__compositex_proxy__.install(props.value)
        } else {
          // TODO toast extension uninstall
          console.log("no")
        }
      }}
    >
      <MaterialSymbolsDownloadRounded />
    </button>
  )
}
