"use client"

import { MaterialSymbolsDownloadRounded } from "@/components/icons"
import { BundledPipeline, MetaNode } from "@/type"
import { CHROME_EXTENSION_URL } from "@/utils/constants"
import clsx from "classnames"

declare global {
  interface Window {
    __compositex_proxy__: {
      install(objects: MetaNode | BundledPipeline | Array<MetaNode | BundledPipeline>): void
      open(path: string): void
    }
  }
}

export default function Installer(props: { value: any }) {
  return (
    <button
      className={clsx("btn btn-sm btn-primary mt-auto")}
      onClick={() => {
        // window.__xxx__.install()
        // cs: create options.html
        // cs: tab.sendmessage
        if (window.__compositex_proxy__) {
          window.__compositex_proxy__.install(props.value)
        } else {
          const confirmed = window.confirm(
            "You should install the extension first, go to install now?"
          )
          if (confirmed) {
            window.location.href = CHROME_EXTENSION_URL
          }
        }
      }}
    >
      <MaterialSymbolsDownloadRounded />
    </button>
  )
}
