"use client"
import clsx from "classnames"
import { animate, useInView } from "framer-motion"
import {
  Bodies,
  Body,
  Common,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
          strokeWidth="2"
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
    value: (x: number) => x / 10,
    label: "÷ 10",
    texture: "/images/sprite-div-10.png",
  },
  {
    value: (x: number) => x + 1,
    label: "+ 1",
    texture: "/images/sprite-add-1.png",
  },
  {
    value: (x: number) => x + 4,
    label: "+ 4",
    texture: "/images/sprite-add-4.png",
  },
  {
    value: (x: number) => x - 2,
    label: "- 2",
    texture: "/images/sprite-min-2.png",
  },
  {
    value: (x: number) => x * 2,
    label: "* 2",
    texture: "/images/sprite-mul-2.png",
  },
]

const SPRITE_WIDTH = 317
const SPRITE_HEIGHT = 139
const SCALE = 1 / 2
const NODE_WIDTH = SPRITE_WIDTH * SCALE
const NODE_HEIGHT = SPRITE_HEIGHT * SCALE
const SPRITE_PLACEHOLDER = "/images/Vector2.png"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 660

const PLACEHOLDER_TOP = 100

const PROGRESS_THRESHOLDS = [0, 0.3, 0.6]

export function Demo(props: { subscribeProgressChange: any }) {
  const { subscribeProgressChange } = props
  const root = useRef<HTMLDivElement | null>(null)
  const [currentCollide, setCurrentCollide] = useState<Body | null>(null)
  const [currentDragged, setCurrentDragged] = useState<Body | null>(null)
  const [activeNodes, setActiveNodes] = useState<Array<Body | null>>([null, null, null])
  const futureActiveNodesRef = useRef<Array<Body | null>>([null, null, null])
  const matterNodes = useRef<Body[]>()
  const matterPlaceholders = useRef<Body[]>()
  const playing = useRef(false)

  const isInView = useInView(root, { amount: 0.3 })

  const play = useRef(() => {
    const currentMatterNodes = matterNodes.current
    if (!currentMatterNodes) return
    if (!playing.current) {
      playing.current = true
      currentMatterNodes
        .filter((item) => !futureActiveNodesRef.current.includes(item))
        .forEach((node) => Body.setStatic(node, false))
    }
  })

  useEffect(() => {
    if (isInView) {
      play.current()
    }
  }, [isInView])

  useEffect(() => {
    activeNodes.forEach((node, index) => {
      if (node && !futureActiveNodesRef.current[index]) futureActiveNodesRef.current[index] = node
    })
  }, [activeNodes])

  useEffect(() => {
    let anied = [false, false, false]
    return subscribeProgressChange((progress: any) => {
      console.log(progress)
      const currentMatterNodes = matterNodes.current
      const currentMatterPlaceholders = matterPlaceholders.current
      if (!currentMatterNodes || !currentMatterPlaceholders) return

      if (progress > 0) {
        play.current()
      }

      const animateNodeToPlaceholder = (node: Body, placeholder: Body) => {
        const startPosition = Common.clone(node.position, false)
        const startAngle = node.angle
        const endPosition = Common.clone(placeholder.position, false)
        const endAngle = placeholder.angle
        const update = (progress: number) => {
          Body.setPosition(node, {
            x: startPosition.x + (endPosition.x - startPosition.x) * progress,
            y: startPosition.y + (endPosition.y - startPosition.y) * progress,
          })
          Body.setAngle(node, startAngle + (endAngle - startAngle) * progress)
        }
        const placeholderIndex = currentMatterPlaceholders.indexOf(placeholder)
        futureActiveNodesRef.current[placeholderIndex] = node
        animate(0, 1, {
          type: "spring",
          // damping: 30,
          stiffness: 30,
          onUpdate: update,
          onComplete: () => {
            Body.setStatic(node, true)
            setActiveNodes((_v) => {
              const v = [..._v]
              v[placeholderIndex] = node
              return v
            })
          },
        })
      }

      const fillPlaceHolder = () => {
        const node = Common.choose(
          currentMatterNodes.filter((item) => !futureActiveNodesRef.current.includes(item))
        )
        const placeholder =
          currentMatterPlaceholders[futureActiveNodesRef.current.findIndex((n) => n === null)]
        console.log(node, placeholder, futureActiveNodesRef.current)
        if (!node || !placeholder) return
        animateNodeToPlaceholder(node, placeholder)
      }

      const activeNodeCount = futureActiveNodesRef.current.filter(Boolean).length
      PROGRESS_THRESHOLDS.forEach((progressThreshold, index) => {
        if (progress > progressThreshold && activeNodeCount <= index && !anied[index]) {
          anied[index] = true
          fillPlaceHolder()
        }
      })
    })
  }, [subscribeProgressChange])

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
        background: "transparent",
      },
    })
    const ground = Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 6, CANVAS_WIDTH, 12, {
      isStatic: true,
      restitution: 1,
      render: {
        fillStyle: undefined,
      },
    })
    const leftWall = Bodies.rectangle(
      6,
      CANVAS_HEIGHT / 2 + PLACEHOLDER_TOP + NODE_HEIGHT,
      12,
      CANVAS_HEIGHT,
      {
        isStatic: true,
        restitution: 1,
        render: {
          fillStyle: undefined,
        },
      }
    )
    const rightWall = Bodies.rectangle(
      CANVAS_WIDTH - 6,
      CANVAS_HEIGHT / 2 + PLACEHOLDER_TOP + NODE_HEIGHT,
      12,
      CANVAS_HEIGHT,
      {
        isStatic: true,
        restitution: 1,
        render: {
          fillStyle: undefined,
        },
      }
    )
    const nodes = NODES.map((item, index) => {
      const x = Math.random() * (CANVAS_WIDTH - NODE_WIDTH - 50) + NODE_WIDTH / 2
      const y = Math.random() * 200 - 250
      const angle = Math.random() * Math.PI
      return Bodies.rectangle(x, y, NODE_WIDTH, NODE_HEIGHT, {
        angle,
        label: index + "",
        isStatic: true,
        render: {
          sprite: {
            texture: item.texture,
            xScale: SCALE,
            yScale: SCALE,
          },
        },
      })
    })
    matterNodes.current = nodes
    const placeholders = [...new Array(3)].map((_, index) => {
      const x =
        ((CANVAS_WIDTH - 3 * NODE_WIDTH) / 4) * (index + 1) + NODE_WIDTH / 2 + NODE_WIDTH * index
      const y = PLACEHOLDER_TOP
      return Bodies.rectangle(x, y, NODE_WIDTH, NODE_HEIGHT, {
        label: index + "",
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      })
    })
    matterPlaceholders.current = placeholders
    Composite.add(engine.world, [ground, leftWall, rightWall, ...nodes, ...placeholders])
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
          visible: false,
        },
      },
    })
    mouseConstraint.mouse.element.removeEventListener(
      "mousewheel",
      // @ts-ignore
      mouseConstraint.mouse.mousewheel
    )
    mouseConstraint.mouse.element.removeEventListener(
      "DOMMouseScroll",
      // @ts-ignore
      mouseConstraint.mouse.mousewheel
    )
    Composite.add(engine.world, mouseConstraint)
    // keep the mouse in sync with rendering
    render.mouse = mouse

    let dragged: Body | null = null
    let collide: Body | null
    const setDragged = (value: typeof dragged) => {
      dragged = value
      setCurrentDragged(dragged)
    }
    const setCollde = (value: typeof collide) => {
      collide = value
      setCurrentCollide(collide)
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
        setActiveNodes((_v) => {
          const v = [..._v]
          const index = parseInt(collideLabel)
          v[index] = body
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

  const activeNodesInNODES = useMemo(() => {
    return activeNodes.filter((n) => {
      return n?.label && NODES[+n.label]
    })
  }, [activeNodes])

  return (
    <div className="flex justify-center gap-4">
      <div ref={root} className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <div
          className={clsx("absolute flex justify-around items-center w-full pointer-events-none")}
          style={{ top: PLACEHOLDER_TOP - NODE_HEIGHT / 2 }}
        >
          <div className="relative -left-2 -translate-x-1/2 text-2xl">0</div>
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
                    opacity: activeNodes[index] !== null ? 0 : !!currentDragged ? 0.7 : 0.3,
                  }}
                />
                <FlowLine
                  active={activeNodes[index] !== null}
                  className={clsx(
                    "flex-1 relative",
                    index === arr.length - 1 &&
                      "after:absolute after:right-0 after:top-1/2 after:translate-x-3/4 after:-translate-y-1/2 after:border-x-8 after:border-y-4 after:border-transparent after:!border-l-primary"
                  )}
                  style={{
                    opacity: activeNodes[index] !== null ? 1 : !!currentDragged ? 0.7 : 0.3,
                  }}
                ></FlowLine>
              </>
            )
          })}
          <div className="relative -right-2 translate-x-1/2 text-2xl">
            {activeNodesInNODES
              .map((node) => NODES[+node!.label].value)
              .reduce((res, handle) => handle(res), 0)}
          </div>
        </div>
        <div
          className="absolute w-full left-0 bottom-0 border-8 rounded border-t-0 border-primary pointer-events-none"
          style={{ height: CANVAS_HEIGHT / 2 + PLACEHOLDER_TOP + NODE_HEIGHT }}
        ></div>
      </div>
    </div>
  )
}
