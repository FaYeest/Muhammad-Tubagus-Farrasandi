import { motion } from 'framer-motion'
import { useMemo } from 'react'

const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      moveX: Math.random() * 60 - 30,
      moveY: Math.random() * -300 - 150,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand-primary/40 dark:bg-brand-primary/60"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: '0 0 15px 4px var(--color-brand-primary)',
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, p.moveY],
            x: [0, p.moveX],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground
