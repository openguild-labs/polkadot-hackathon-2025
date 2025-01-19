import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const hackathons = [
    {
        id: 1,
        name: "Squat Challenge Hackathon",
        type: "squat",
        startDate: "2024-07-15",
        endDate: "2024-07-22",
        participants: 120,
        maxParticipants: 200,
        price: 49.99,
        image: "/squatAI.png"
    },
    {
        id: 2,
        name: "Push-Up Power Weekend",
        type: "push up",
        startDate: "2024-08-05",
        endDate: "2024-08-07",
        participants: 85,
        maxParticipants: 150,
        price: 79.99,
        image: "/pushup.png"
    },
    {
        id: 3,
        name: "Jumping Jack Marathon",
        type: "jumping jack",
        startDate: "2024-09-10",
        endDate: "2024-09-17",
        participants: 60,
        maxParticipants: 100,
        price: 59.99,
        image: "/jumpingjack.png"
    },
    {
        id: 4,
        name: "Core Crunch Challenge",
        type: "curl crunch",
        startDate: "2024-10-01",
        endDate: "2024-10-08",
        participants: 95,
        maxParticipants: 180,
        price: 69.99,
        image: "/curlcrunch.png",
    }
];

export default function AllHackathon({ onJoinHackathon }) {
    const [joinedHackathons, setJoinedHackathons] = useState({});
    const [loadingStates, setLoadingStates] = useState({});

    const handleJoinHackathon = (hackathon) => {
        // Set loading state for this specific hackathon
        setLoadingStates(prev => ({
            ...prev,
            [hackathon.id]: true
        }));

        // Simulate API call or blockchain transaction
        setTimeout(() => {
            // Update joined hackathons state
            setJoinedHackathons(prev => ({
                ...prev,
                [hackathon.id]: {
                    ...hackathon,
                    joinedAt: new Date().toLocaleString()
                }
            }));

            // Remove loading state
            setLoadingStates(prev => ({
                ...prev,
                [hackathon.id]: false
            }));

            // Call the parent component's join handler to generate NFT
            onJoinHackathon(hackathon);
        }, 2000); // Simulated 2-second loading
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
            <Swiper
                effect={'coverflow'}
                loop={true}
                grabCursor={true}
                centeredSlides={true}
                spaceBetween={30}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        coverflowEffect: {
                            rotate: 30,
                            stretch: 0,
                            depth: 50,
                            modifier: 1,
                            slideShadows: false,
                        }
                    },
                    768: {
                        slidesPerView: 2,
                        coverflowEffect: {
                            rotate: 40,
                            stretch: 0,
                            depth: 75,
                            modifier: 1,
                            slideShadows: true,
                        }
                    },
                    1024: {
                        slidesPerView: 3,
                        coverflowEffect: {
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }
                    }
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[EffectCoverflow, Pagination]}
                className="w-full max-w-[1100px] h-[500px] px-4"
            >
                {hackathons.map((hackathon) => (
                    <SwiperSlide key={hackathon.id} className="flex items-center justify-center">
                        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden w-full max-w-sm">
                            <img
                                src={hackathon.image}
                                alt={hackathon.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2 text-white">{hackathon.name}</h2>

                                <div className="grid grid-cols-1 gap-2 mb-4 text-gray-300">
                                    <div className="flex justify-between text-sm">
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-medium">{hackathon.type}</p>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <p className="text-sm text-gray-500">Dates</p>
                                        <p className="font-medium">
                                            {new Date(hackathon.startDate).toLocaleDateString()} -
                                            {new Date(hackathon.endDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <p className="text-sm text-gray-500">Participants</p>
                                        <p className="font-medium">
                                            {hackathon.participants}/{hackathon.maxParticipants}
                                        </p>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-medium">${hackathon.price}</p>
                                    </div>
                                </div>

                                {joinedHackathons[hackathon.id] ? (
                                    <div className="w-full bg-green-600 text-white py-2 rounded-lg text-center">
                                        <p>Joined Successfully</p>
                                        <p className="text-sm">
                                            Joined at: {joinedHackathons[hackathon.id].joinedAt}
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleJoinHackathon(hackathon)}
                                        disabled={loadingStates[hackathon.id]}
                                        className={`w-full text-white py-2 rounded-lg transition ${
                                            loadingStates[hackathon.id] 
                                                ? 'bg-gray-500 cursor-not-allowed' 
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {loadingStates[hackathon.id] ? (
                                            <div className="flex items-center justify-center">
                                                <svg 
                                                    className="animate-spin h-5 w-5 mr-3" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle 
                                                        className="opacity-25" 
                                                        cx="12" 
                                                        cy="12" 
                                                        r="10" 
                                                        stroke="currentColor" 
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path 
                                                        className="opacity-75" 
                                                        fill="currentColor" 
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Joining...
                                            </div>
                                        ) : (
                                            'Join Hackathon'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}