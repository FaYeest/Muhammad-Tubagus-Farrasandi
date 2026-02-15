import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

const NODE_COLORS = {
  github: '#69986E',
  product: '#8FAE7A',
}

function getId(nodeValue) {
  return typeof nodeValue === 'object' ? nodeValue.id : nodeValue
}

function ProjectGraph({ projects, relations, isDark }) {
  const graphRef = useRef(null)
  const containerRef = useRef(null)

  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 360,
  })
  const [hoveredNode, setHoveredNode] = useState(null)

  const neighbors = useMemo(() => {
    const map = new Map()
    projects.forEach((project) => map.set(project.id, new Set()))

    relations.forEach((relation) => {
      map.get(relation.source)?.add(relation.target)
      map.get(relation.target)?.add(relation.source)
    })

    return map
  }, [projects, relations])

  const activeIds = useMemo(() => {
    if (!hoveredNode) {
      return null
    }

    const ids = new Set(neighbors.get(hoveredNode.id) || [])
    ids.add(hoveredNode.id)
    return ids
  }, [hoveredNode, neighbors])

  const graphData = useMemo(
    () => ({
      nodes: projects.map((project) => ({
        id: project.id,
        title: project.title,
        role: project.role,
        source: project.source,
        url: project.liveUrl || project.repoUrl,
      })),
      links: relations.map((relation) => ({
        source: relation.source,
        target: relation.target,
        strength: relation.strength,
      })),
    }),
    [projects, relations],
  )

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) {
        return
      }

      const width = containerRef.current.clientWidth
      const height = width < 720 ? 300 : 360
      setCanvasSize({ width, height })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!graphRef.current || !canvasSize.width) {
      return
    }

    const chargeForce = graphRef.current.d3Force('charge')
    const linkForce = graphRef.current.d3Force('link')

    if (chargeForce && typeof chargeForce.strength === 'function') {
      chargeForce.strength(-210)
    }

    if (linkForce && typeof linkForce.distance === 'function') {
      linkForce.distance((link) => 142 - link.strength * 12)
    }

    if (typeof graphRef.current.d3VelocityDecay === 'function') {
      graphRef.current.d3VelocityDecay(0.26)
    } else if (typeof graphRef.current.d3AlphaDecay === 'function') {
      graphRef.current.d3AlphaDecay(0.045)
    }

    const timer = setTimeout(() => {
      graphRef.current.zoomToFit(500, 38)
    }, 250)

    return () => clearTimeout(timer)
  }, [canvasSize.width, graphData])

  return (
    <div className="mt-3.5 p-3 border border-brand-line rounded-2xl bg-brand-surface-muted transition-colors duration-500">
      <div className="w-full min-h-[340px] border border-brand-primary/28 rounded-xl bg-brand-surface overflow-hidden transition-colors duration-500" ref={containerRef}>
        {canvasSize.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            width={canvasSize.width}
            height={canvasSize.height}
            graphData={graphData}
            backgroundColor="transparent"
            nodeLabel={(node) => `${node.title} - ${node.role}`}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const isActive = activeIds ? activeIds.has(node.id) : true
              const baseRadius = node.source === 'product' ? 9 : 8
              const radius =
                hoveredNode && hoveredNode.id === node.id ? baseRadius + 2 : baseRadius

              ctx.beginPath()
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
              ctx.fillStyle = isActive
                ? NODE_COLORS[node.source]
                : isDark ? 'rgba(138, 171, 119, 0.15)' : 'rgba(138, 171, 119, 0.26)'
              ctx.fill()

              ctx.lineWidth = 1.7
              ctx.strokeStyle = isActive 
                ? (isDark ? '#0f1410' : '#f5f4ef') 
                : (isDark ? 'rgba(15, 20, 16, 0.45)' : 'rgba(245, 244, 239, 0.45)')
              ctx.stroke()

              const label = node.title
              const fontSize = 11 / globalScale
              ctx.font = `600 ${fontSize}px "Outfit", sans-serif`
              ctx.fillStyle = isActive 
                ? (isDark ? '#e8eee7' : '#1F2A22') 
                : (isDark ? 'rgba(232, 238, 231, 0.42)' : 'rgba(31, 42, 34, 0.42)')
              ctx.textAlign = 'left'
              ctx.textBaseline = 'middle'
              ctx.fillText(label, node.x + radius + 4, node.y)
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color
              ctx.beginPath()
              ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false)
              ctx.fill()
            }}
            linkColor={(link) => {
              const source = getId(link.source)
              const target = getId(link.target)

              if (!hoveredNode) {
                return isDark ? 'rgba(105, 152, 110, 0.25)' : 'rgba(105, 152, 110, 0.45)'
              }

              return source === hoveredNode.id || target === hoveredNode.id
                ? (isDark ? 'rgba(105, 152, 110, 0.95)' : 'rgba(77, 118, 82, 0.95)')
                : (isDark ? 'rgba(105, 152, 110, 0.1)' : 'rgba(105, 152, 110, 0.2)')
            }}
            linkWidth={(link) => {
              const source = getId(link.source)
              const target = getId(link.target)
              const width = 0.8 + link.strength * 0.6

              if (!hoveredNode) {
                return width
              }

              return source === hoveredNode.id || target === hoveredNode.id
                ? width + 1
                : 0.45
            }}
            linkDirectionalParticles={(link) => {
              if (!hoveredNode) {
                return 0
              }

              const source = getId(link.source)
              const target = getId(link.target)
              return source === hoveredNode.id || target === hoveredNode.id ? 2 : 0
            }}
            linkDirectionalParticleSpeed={() => 0.004}
            cooldownTicks={100}
            onNodeHover={(node) => {
              setHoveredNode(node || null)

              if (containerRef.current) {
                containerRef.current.style.cursor = node ? 'pointer' : 'default'
              }
            }}
            onNodeClick={(node) => {
              if (!node.url) {
                return
              }

              window.open(node.url, '_blank', 'noopener,noreferrer')
            }}
          />
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 border border-brand-line rounded-full bg-brand-surface text-brand-ink-soft text-[0.74rem] font-semibold transition-colors duration-500">Node Hijau: GitHub Project</span>
        <span className="px-2.5 py-1 border border-brand-line rounded-full bg-brand-surface text-brand-ink-soft text-[0.74rem] font-semibold transition-colors duration-500">Node Olive: Product Build</span>
        <span className="px-2.5 py-1 border border-brand-line rounded-full bg-brand-surface text-brand-ink-soft text-[0.74rem] font-semibold transition-colors duration-500">Klik node untuk buka project</span>
      </div>
    </div>
  )
}

export default ProjectGraph
