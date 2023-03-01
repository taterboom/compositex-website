"use client"
import { BundledPipeline, MetaNode } from "@/type"
import Installer from "./Installer"
import clsx from "classnames"

export function MetaNodeItem(props: { value: MetaNode }) {
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
      <th>{props.index + 1}</th>
      <td>{props.value.config.name}</td>
      <td>
        {props.value.config.desc} {props.value.config.desc}
      </td>
    </tr>
  )
}
export function PipelineItem(props: { value: BundledPipeline; className?: string }) {
  const pipeline = props.value
  return (
    <div
      key={pipeline.id}
      className={clsx(
        "card max-w-[480px] min-w-[260px] p-4 bg-base-300 shadow-xl gap-2",
        props.className
      )}
    >
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
