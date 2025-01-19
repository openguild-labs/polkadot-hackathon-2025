import React from 'react';
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

export default function MyHackathon({ myNFTs }) {
    const handleClaim = (hackathon) => {
        // Implement claim logic here
        console.log(`Claiming hackathon: ${hackathon.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
            {myNFTs.length === 0 ? (
                <div className="text-center text-gray-400">
                    <p>No Hackathon NFTs yet. Join a hackathon to get started!</p>
                </div>
            ) : (
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
                    {myNFTs.map((nft) => (
                        <SwiperSlide key={nft.nftId} className="flex items-center justify-center">
                            <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden w-full max-w-sm">
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2 text-white">{nft.name}</h2>

                                    <div className="grid grid-cols-1 gap-2 mb-4 text-gray-300">

                                        <div className="flex justify-between text-sm">
                                            <p className="text-sm text-gray-500">Type</p>
                                            <p className="font-medium">{nft.type}</p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Dates:</span>
                                            <span className="text-gray-200">{new Date(nft.startDate).toLocaleDateString()} - {new Date(nft.endDate).toLocaleDateString()}</span>
                                        </div>


                                        <div className="flex justify-between text-sm">
                                            <p className="text-sm text-gray-500">Participants</p>
                                            <p className="font-medium">
                                                {nft.participants}/{nft.maxParticipants}
                                            </p>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="font-medium">${nft.price}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleClaim(nft)}
                                        disabled={true}
                                        className={`w-full py-2 rounded-lg transition bg-gray-600 text-white`}
                                    >
                                        Claim
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))};
                </Swiper>
            )}
        </div>
    )
}