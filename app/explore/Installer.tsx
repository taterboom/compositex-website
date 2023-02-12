"use client"

import { MaterialSymbolsDownloadRounded } from "@/components/icons"
import clsx from "classnames"

export default function Installer(props: { value: any }) {
  return (
    <button
      className={clsx("btn")}
      onClick={() => {
        // window.__xxx__.install()
        // cs: create options.html
        // cs: tab.sendmessage
      }}
    >
      <MaterialSymbolsDownloadRounded />
    </button>
  )
}
