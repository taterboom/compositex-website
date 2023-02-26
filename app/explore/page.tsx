import { isMetaNode } from "@/utils/helper"
import { MaterialSymbolsDownloadRounded } from "@/components/icons"
import clsx from "classnames"
import { BundledPipeline, MetaNode } from "@/type"
import Installer from "./Installer"
import { data } from "@/utils/exploreData"

function installMetaNode(metaNode: any) {}

function installPipeline(pipeline: any) {}

function MetaNodeItem(props: { value: MetaNode }) {
  const metaNode = props.value
  return (
    <div className="card max-w-[480px] p-4 bg-base-300 shadow-xl gap-2">
      <div className="text-lg font-semibold">{metaNode.config.name}</div>
      <div className="text-base-content/70">{metaNode.config.desc}</div>
      <Installer value={props.value} />
    </div>
  )
}

function TinyMetaNode(props: { value: MetaNode; index: number }) {
  return (
    <tr>
      <th>{props.index}</th>
      <td>{props.value.config.name}</td>
      <td>
        {props.value.config.desc} {props.value.config.desc}
      </td>
    </tr>
  )
}

function PipelineItem(props: { value: BundledPipeline }) {
  const pipeline = props.value
  return (
    <div key={pipeline.id} className="card max-w-[480px] p-4 bg-base-300 shadow-xl gap-2">
      <div className="text-lg font-semibold">{pipeline.name}</div>
      <div className="text-base-content/70">{pipeline.desc}</div>
      {props.value.nodes.length > 0 && (
        <div>
          <div className="dropdown">
            <label tabIndex={0} className="text-info/70 text-sm cursor-pointer">
              {props.value.nodes.length} Nodes included
            </label>
            <div
              tabIndex={0}
              className="dropdown-content w-72 overflow-x-auto base-200 border border-base-content/10 rounded"
            >
              <table className="table table-compact max-w-2xl">
                <thead>
                  <tr>
                    <th></th>
                    <th>name</th>
                    <th>desc</th>
                  </tr>
                </thead>
                <tbody>
                  {props.value.nodes.map((node, index) => (
                    <TinyMetaNode
                      key={node.metaId}
                      value={node.metaNode}
                      index={index}
                    ></TinyMetaNode>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Installer value={props.value} />
    </div>
  )
}

export default async function Explore() {
  const objects: any[] = data

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {objects.map((item) =>
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
