import { isMetaNode } from "@/utils/helper"
import { MaterialSymbolsDownloadRounded } from "@/components/icons"
import clsx from "classnames"
import { BundledPipeline, MetaNode } from "@/type"
import Installer from "./Installer"

function installMetaNode(metaNode: any) {}

function installPipeline(pipeline: any) {}

function MetaNodeItem(props: { value: MetaNode }) {
  const metaNode = props.value
  return (
    <div className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div className="text-lg font-semibold">{metaNode.config.name}</div>
      <div>{metaNode.config.desc}</div>
      <Installer value={props.value} />
    </div>
  )
}

function TinyMetaNode(props: { value: MetaNode }) {
  return (
    <div className="flex space-x-1">
      <div>{props.value.config.name}</div>
    </div>
  )
}

function PipelineItem(props: { value: BundledPipeline }) {
  const pipeline = props.value
  return (
    <div key={pipeline.id} className="card max-w-[480px] p-4 mt-4 bg-base-200 shadow-xl space-y-2">
      <div className="text-lg font-semibold">{pipeline.name}</div>
      <div>{pipeline.desc}</div>
      <div>
        {props.value.nodes.map((node) => (
          <TinyMetaNode key={node.metaId} value={node.metaNode}></TinyMetaNode>
        ))}
      </div>
      <Installer value={props.value} />
    </div>
  )
}

export default async function Explore() {
  const objects: any[] = await fetch(`${process.env.ENDPOINT}/api/explore/objects`).then((res) =>
    res.json()
  )
  return (
    <div>
      {objects.map((item) =>
        isMetaNode(item) ? (
          <MetaNodeItem key={item.id} value={item} />
        ) : (
          <PipelineItem key={item.id} value={item} />
        )
      )}
    </div>
  )
}
