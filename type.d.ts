export type TypeDefinition = {
  type: "string" | "number" | "boolean" | "json" | "enum" | "any"
  enumItems?: { name: string; value: string }[]
  desc?: string
}

export type Option = {
  name: string
  default?: any
} & TypeDefinition

export type RunningContext = any

export type MetaNode = {
  _raw: string
  id: string
  config: {
    name: string
    desc?: string
    input?: TypeDefinition
    output?: TypeDefinition
    options?: Option[]
  }
  run(input: any, options: Record<string, any>, context: RunningContext): any
}

export type Node = {
  metaId: string
  name?: string
  options?: Record<string, any>
}

export type IdentityNode = { id: string } & Node

export type Pipeline = {
  id: string
  name?: string
  desc?: string
  nodes: Node[]
}

export type BundledPipeline = Omit<Pipeline, "nodes"> & {
  nodes: Array<Node & { metaNode: MetaNode }>
}

export type ProgressItem = {
  ok: boolean
  pipelineId: string
  index: number
  result?: any
  error?: any
}
