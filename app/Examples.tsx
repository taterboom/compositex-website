import { MaterialSymbolsChevronRightRounded } from "@/components/icons"
import { PipelineItem } from "@/components/Item"
import { data } from "@/utils/exploreData"
import { isMetaNode } from "@/utils/helper"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Examples() {
  const objects: any[] = data.filter((item) => !isMetaNode(item)).slice(0, 4)

  return (
    <motion.div
      className="my-32"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut", duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-center my-8">Examples</h3>
      <div className="flex justify-center items-center gap-8 flex-wrap max-w-[900px] p-4 mx-auto">
        {objects.slice(0, 2).map((item) => (
          <PipelineItem key={item.id} value={item} className="flex-1" />
        ))}
      </div>
      <div className="flex justify-center items-center gap-8 flex-wrap max-w-[900px] p-4 mx-auto">
        {objects.slice(2).map((item) => (
          <PipelineItem key={item.id} value={item} className="flex-1" />
        ))}
      </div>
      <Link href="/explore" className="!flex mx-auto my-4 btn btn-link btn-primary gap-1">
        Explore More <MaterialSymbolsChevronRightRounded />
      </Link>
    </motion.div>
  )
}
