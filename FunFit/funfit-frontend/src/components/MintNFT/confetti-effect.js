"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const generateConfetti = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -20 - Math.random() * 100,
    size: 5 + Math.random() * 5,
    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
  }))
}

export function ConfettiEffect() {
  const [confetti, setConfetti] = useState(generateConfetti(50))

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfetti([])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
          }}
          initial={{ opacity: 0, y: piece.y }}
          animate={{
            opacity: [1, 1, 0],
            y: ['0%', '100%'],
            x: [piece.x + '%', `${piece.x + (Math.random() - 0.5) * 20}%`],
          }}
          transition={{ duration: 5, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}