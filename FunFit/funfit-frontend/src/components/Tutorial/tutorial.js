import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SquatTutorial() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI-Powered Squat Tutorial</h1>
      
      <div className="relative w-full pb-[56.25%] mb-6">
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/m25_ftb7Mls" 
          title="AI-Powered Squat Tutorial"
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">About This Tutorial</h2>
        <p className="mb-4">
          This video tutorial demonstrates how artificial intelligence can be used to analyze and improve your squat form. 
          AI technology can provide real-time feedback on your posture, depth, and overall technique, helping you 
          maximize the effectiveness of your workouts while minimizing the risk of injury.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Key Points</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Understanding proper squat form</li>
          <li>How AI tracks your movements</li>
          <li>Real-time feedback and corrections</li>
          <li>Tracking progress over time</li>
        </ul>
      </div>

      <div className="mt-8">
        <button 
          onClick={() => router.push('/squat')} 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Let's Do Exercise
        </button>
      </div>
    </div>
  )
}