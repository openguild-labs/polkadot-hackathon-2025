"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MissionCards() {
  const router = useRouter()
  const [selectedMission, setSelectedMission] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const missions = [
    {
      title: "Squat Mission",
      description: "Build lower body strength",
      image: "/squatAI.png",
      isLocked: false,
      correct: 5,
      maxTurn: 50,
    },
    {
      title: "Push Up Mission",
      description: "Strengthen your upper body",
      image: "/pushup.png",
      isLocked: true,
      correct: 10,
      maxTurn: 50,
    },
    {
      title: "Jumping Jack Mission",
      description: "Boost your cardio",
      image: "/jumpingjack.png",
      isLocked: true,
      correct: 20,
      maxTurn: 50,
    },
    {
      title: "Curl Crunch Mission",
      description: "Target your core muscles",
      image: "/curlcrunch.png",
      isLocked: true,
      correct: 30,
      maxTurn: 50,
    }
  ]

  const handleMissionClick = (mission) => {
    if (!mission.isLocked) {
      setSelectedMission(mission)
      setIsModalOpen(true)
    }
  }

  const handleTutorial = () => {
    if (selectedMission) {
      // Navigate to tutorial page for the specific mission
      router.push(`/tutorial`)
    }
  }

  const handleExercise = () => {
    if (selectedMission) {
      // Navigate to exercise page for the specific mission
      router.push(`/squat`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {missions.map((mission, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full h-full p-0 hover:bg-transparent ${mission.isLocked ? 'cursor-not-allowed' : 'hover:scale-105'}`}
            onClick={() => handleMissionClick(mission)}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
              <img
                src={mission.image}
                alt={mission.title}
                className={`w-full h-full object-cover ${mission.isLocked && "filter grayscale brightness-50"}`}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Lock overlay for locked missions */}
              {mission.isLocked && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <Lock className="w-12 h-12 text-white/80 mb-2" />
                  <span className="text-white/80 text-sm font-medium">Complete previous mission to unlock</span>
                </div>
              )}
              
              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 ${mission.isLocked ? "text-white/60" : "text-white"}`}>
                  {mission.title}
                </h3>
                <p className={`text-sm ${mission.isLocked ? "text-gray-400" : "text-gray-200"}`}>
                  {mission.description}
                </p>
                <p className={`text-sm ${mission.isLocked ? "text-gray-400" : "text-gray-200"}`}>
                  Pass: {mission.correct}/{mission.maxTurn}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Mission Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{selectedMission?.title}</DialogTitle>
            <DialogDescription>
              Choose how you want to proceed with this mission
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              onClick={handleTutorial}
              className="w-full"
            >
              View Tutorial
            </Button>
            <Button 
              onClick={handleExercise}
              className="w-full"
            >
              Start Exercise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}