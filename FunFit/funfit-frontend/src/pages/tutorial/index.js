import { useRouter } from 'next/navigation'
import SquatTutorial from '@/components/Tutorial/tutorial'
export default function SquatTutorialPage() {
    const router = useRouter()
    return (
        <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
            <div className="w-full">
                <SquatTutorial />
            </div>
        </div>
    )
}
