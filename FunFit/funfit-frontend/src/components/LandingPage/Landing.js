'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Zap, Trophy, Clock, Shield, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function BlockchainFitnessLanding() {
    const router = useRouter();
    const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])

  const features = [
    {
      title: "Mint Your Fitness NFT",
      description: "Create a unique digital fitness persona that grows with your journey.",
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "AI-Powered Training",
      description: "Real-time tracking, personalized coaching, and intelligent workout planning.",
      icon: <Trophy className="w-8 h-8 text-green-400" />,
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Global Fitness Challenges",
      description: "Compete worldwide, earn crypto rewards, and push your limits.",
      icon: <Clock className="w-8 h-8 text-red-400" />,
      gradient: "from-red-500 to-orange-600"
    },
    {
      title: "Secure Blockchain Management",
      description: "Transparent, decentralized tracking of your fitness achievements and assets.",
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      gradient: "from-purple-500 to-indigo-600"
    }
  ]

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <motion.main 
        style={{
          translateY: heroY,
          scale: heroScale,
          opacity: heroOpacity
        }}
        className="relative z-10"
      >
        <section className="container mx-auto px-4 py-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Transform Fitness with Blockchain & AI
            </h1>
            <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Revolutionize your health journey through cutting-edge technology, personalized AI training, and decentralized fitness rewards.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-all"
              >
                Start Your Journey
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-700 text-white hover:bg-gray-800 transition-all"
                onClick={() => router.push('/mint')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:scale-105 transition-all group"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className={`ml-4 text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  )
}