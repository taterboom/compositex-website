import { MetaNode } from "@/type"

export function isMetaNode(object: any): object is MetaNode {
  return "_raw" in object
}
