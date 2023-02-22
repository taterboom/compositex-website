"use client"
import {
  Common,
  Composite,
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Mouse,
  MouseConstraint,
  World,
  Events,
  Query,
  Vertices,
  IBodyDefinition,
} from "matter-js"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "classnames"
import { useMotionValueEvent, useScroll, clamp } from "framer-motion"

function FlowLine(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    active?: boolean
  }
) {
  return (
    <div {...props}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 100 50 H 0"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4, 10"
          strokeDashoffset="0"
          className={clsx(props.active && "animate-flow")}
        ></path>
      </svg>
    </div>
  )
}

// const partA = 20
// const partB = 86
// const partC = 160
// const partD = 70
// const partE = (partB - partD) / 2
// // @ts-ignore
// Vertices.chamfer(
//   // @ts-ignore
//   Vertices.fromPath(
//     `L 0 0 L ${partA} 0 L ${partA} ${partE} L ${partA + partC} ${partE} L ${
//       partA + partC
//     } 0 L ${partA + partC + partA} 0 L ${partA + partC + partA} ${partB} L ${
//       partA + partC
//     } ${partB} L ${partA + partC} ${partB - partE} L ${partA} ${
//       partB - partE
//     } L ${partA} ${partB} L 0 ${partB}`
//   ),
//   [4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4]
// )

// 使用 texture 来设置文字

const NODES = [
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
  {
    value: -1,
  },
  {
    value: -2,
  },
]

const SPRITE_WIDTH = 317
const SPRITE_HEIGHT = 139
const SCALE = 1 / 2
const NODE_WIDTH = SPRITE_WIDTH * SCALE
const NODE_HEIGHT = SPRITE_HEIGHT * SCALE
const SPRITE_NODE = "/images/Vector.png"
const SPRITE_PLACEHOLDER = "/images/Vector2.png"
function createNode(
  type: "node" | "placeholder",
  position: { x: number; y: number },
  options?: IBodyDefinition
) {
  const body = Bodies.rectangle(position.x, position.y, NODE_WIDTH, NODE_HEIGHT, {
    ...options,
    isSensor: type === "placeholder",
    isStatic: type === "placeholder",
    render: {
      ...options?.render,
      ...(type === "node"
        ? {
            sprite: {
              texture: SPRITE_NODE,
              xScale: SCALE,
              yScale: SCALE,
            },
          }
        : {}),
      ...(type === "placeholder" ? { visible: false } : {}),
    },
  })
  return body
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

export function Demo() {
  const root = useRef<HTMLDivElement | null>(null)
  const [currentCollide, setCurrentCollide] = useState<string>()
  const [currentDragged, setCurrentDragged] = useState<string>()
  const [activeNodes, setActiveNodes] = useState<any[]>([])
  const { scrollY, scrollYProgress } = useScroll()
  const [span, setSpan] = useState<null | [number, number]>(null)
  const matterNodes = useRef()
  const matterPlaceholders = useRef()

  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log("Page scroll: ", latest, scrollYProgress)
    if (!span) return
    const progress = clamp(0, 1, (latest - span[0]) / span[1])
    // TODO p1 => p2
  })

  useEffect(() => {
    if (!root.current) return
    const rootRect = root.current.getBoundingClientRect()
    const scrollTop = document.documentElement.scrollTop
    const rootTop = scrollTop + rootRect.top
    const rootHeight = rootRect.height
    setSpan([rootTop, rootTop + rootHeight])
  }, [])

  useEffect(() => {
    if (!root.current) return
    const engine = Engine.create()
    const render = Render.create({
      element: root.current,
      engine,
      options: {
        // showAngleIndicator: true,
        wireframes: false,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      },
    })
    const ground = Bodies.rectangle(300, 300, 600, 40, {
      isStatic: true,
      restitution: 1,
      render: { fillStyle: "#11f", strokeStyle: "#fff" },
    })
    const nodes = NODES.map((item, index) => {
      const x = Math.random() * (CANVAS_WIDTH - NODE_WIDTH) + NODE_WIDTH / 2
      const y = Math.random() * 200 - 200
      const angle = Math.random() * Math.PI
      return createNode(
        "node",
        { x, y },
        {
          angle,
          label: item.value + "",
        }
      )
    })
    const placeholders = [...new Array(3)].map((_, index) => {
      const x =
        ((CANVAS_WIDTH - 3 * NODE_WIDTH) / 4) * (index + 1) + NODE_WIDTH / 2 + NODE_WIDTH * index
      const y = 400
      return createNode("placeholder", { x, y }, { label: index + "" })
    })
    Composite.add(engine.world, [ground, ...nodes, ...placeholders])
    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)
    // add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    })
    Composite.add(engine.world, mouseConstraint)
    // keep the mouse in sync with rendering
    render.mouse = mouse

    let dragged: Body | null = null
    let collide: Body | null
    const setDragged = (value: typeof dragged) => {
      dragged = value
      setCurrentDragged(dragged?.label)
    }
    const setCollde = (value: typeof collide) => {
      collide = value
      setCurrentCollide(collide?.label)
    }
    Events.on(mouseConstraint, "startdrag", (e) => {
      console.log("sd", e)
      e.body.render.strokeStyle = "#f11"
      setDragged(e.body)
    })
    Events.on(mouseConstraint, "enddrag", (e) => {
      console.log("ed", e, collide)
      const body = e.body as Body
      setDragged(null)
      body.render.strokeStyle = "#fff"
      if (collide?.label && body?.label) {
        body.isStatic = true
        console.log(collide.label)
        Body.setPosition(body, collide.position)
        Body.setAngle(body, collide.angle)
        const collideLabel = collide!.label
        const draggedLabel = body.label
        setActiveNodes((_v) => {
          const v = [..._v]
          const index = parseInt(collideLabel)
          v[index] = draggedLabel
          return v
        })
        collide = null
      }
    })
    // an example of using collisionStart event on an engine
    Events.on(engine, "collisionStart", function (event) {
      console.log("cs", event, [...event.pairs])
      var pairs = event.pairs

      // change object colours to show those starting a collision
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i]
        if (
          (dragged === pair.bodyA && placeholders.includes(pair.bodyB)) ||
          (dragged === pair.bodyB && placeholders.includes(pair.bodyA))
        ) {
          pair.bodyA.render.fillStyle = "#333"
          pair.bodyB.render.fillStyle = "#333"
          setCollde(dragged === pair.bodyA ? pair.bodyB : pair.bodyA)
        }
      }
    })

    // an example of using collisionActive event on an engine
    Events.on(engine, "collisionActive", function (event) {
      var pairs = event.pairs

      // change object colours to show those in an active collision (e.g. resting contact)
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i]
        if (
          (dragged === pair.bodyA && placeholders.includes(pair.bodyB)) ||
          (dragged === pair.bodyB && placeholders.includes(pair.bodyA))
        ) {
          pair.bodyA.render.fillStyle = "#333"
          pair.bodyB.render.fillStyle = "#333"
          setCollde(dragged === pair.bodyA ? pair.bodyB : pair.bodyA)
        }
      }
    })

    // an example of using collisionEnd event on an engine
    Events.on(engine, "collisionEnd", function (event) {
      var pairs = event.pairs

      // change object colours to show those ending a collision
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i]
        if (
          (dragged === pair.bodyA && placeholders.includes(pair.bodyB)) ||
          (dragged === pair.bodyB && placeholders.includes(pair.bodyA))
        ) {
          pair.bodyA.render.fillStyle = "#222"
          pair.bodyB.render.fillStyle = "#222"
          setCollde(null)
        }
      }
    })
    // Events.on(engine, "afterUpdate", (e) => {
    //   console.log("afterUpdate", e)
    //   console.log("query1", Query.collides(boxA, Composite.allBodies(engine.world)))
    //   if (!dragged) {
    //     collides = null
    //     return
    //   }
    //   collides = Query.collides(dragged, Composite.allBodies(engine.world)).map(
    //     (item) => item.bodyB
    //   )
    //   collides.forEach((b) => {
    //     b.render.strokeStyle = "#1f1"
    //   })
    // })
    // Events.on(mouseConstraint, "mousemove", (e) => {
    //   console.log("query2", Query.point(Composite.allBodies(engine.world), e.mouse.position))
    //   collides = Query.point(Composite.allBodies(engine.world), e.mouse.position)
    // })
    Events.on(render, "beforeRender", (e) => {
      //   console.log("beforeRender", e, dragged, collides)
      //   if (collides) {
      //     collides.forEach((item) => (item.render.fillStyle = "#ffff1f"))
      //   }
      // console.log(boxA, boxCustom, bodyCustom1)
    })

    // setTimeout(() => {
    //   Runner.stop(runner)
    // }, 5000)

    return () => {
      Runner.stop(runner)
      Render.stop(render)
      Engine.clear(engine)
      World.clear(engine.world, false)
      Composite.clear(engine.world, false)
      render.canvas.remove()
      render.textures = {}
    }
  }, [])
  return (
    <div ref={root} className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <div
        className={clsx("absolute flex justify-around items-center w-full pointer-events-none")}
        style={{ top: 400 - NODE_HEIGHT / 2 }}
      >
        <FlowLine
          active
          className={clsx(
            "flex-1 relative",
            "after:absolute after:left-0 after:top-1/2 after:-translate-x-3/4 after:-translate-y-1/2 after:border-4 after:border-primary after:rounded-full"
          )}
        />
        {[...new Array(3)].map((_, index, arr) => {
          return (
            <>
              <Image
                key={index}
                src={SPRITE_PLACEHOLDER}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                alt=""
                style={{
                  opacity: activeNodes[index] !== undefined ? 0 : !!currentDragged ? 0.7 : 0.3,
                }}
              />
              <FlowLine
                active={activeNodes[index] !== undefined}
                className={clsx(
                  "flex-1 relative",
                  index === arr.length - 1 &&
                    "after:absolute after:right-0 after:top-1/2 after:translate-x-3/4 after:-translate-y-1/2 after:border-x-8 after:border-y-4 after:border-transparent after:!border-l-primary"
                )}
                style={{
                  opacity: activeNodes[index] !== undefined ? 1 : !!currentDragged ? 0.7 : 0.3,
                }}
              ></FlowLine>
            </>
          )
        })}
      </div>
      <div className="absolute top-0 left-0">
        {activeNodes.join(" ")} = {activeNodes.reduce((a, b) => parseInt(a) + parseInt(b), 0)}
      </div>
    </div>
  )
}
