"use client"

import { isMetaNode } from "@/utils/helper"
import { data } from "@/utils/exploreData"
import { useMemo, useState } from "react"
import { CHROME_EXTENSION_URL } from "@/utils/constants"
import { MetaNodeItem, PipelineItem } from "../../components/Item"

export default function Explore() {
  const [searchString, setSearchString] = useState("")
  const objects: any[] = data

  const searchedObjects = useMemo(() => {
    if (!searchString) return objects
    const search = searchString.trim().toLowerCase()
    return objects.filter((item) =>
      isMetaNode(item)
        ? item.config?.name?.toLowerCase().includes(search) ||
          item.config?.desc?.toLowerCase().includes(search)
        : item.name?.toLowerCase().includes(search) || item.desc?.toLowerCase().includes(search)
    )
  }, [objects, searchString])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-sm "
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <div className="flex items-center gap-1 opacity-70 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info flex-shrink-0 w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span
            onClick={() => {
              if (window.__compositex_proxy__) {
                window.__compositex_proxy__.open("/explore")
              } else {
                window.location.href = CHROME_EXTENSION_URL
              }
            }}
          >
            View details in the extension
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {searchedObjects.map((item) =>
          isMetaNode(item) ? (
            <MetaNodeItem key={item.id} value={item} />
          ) : (
            <PipelineItem key={item.id} value={item} />
          )
        )}
      </div>
    </div>
  )
}
