import { useEffect, useState } from "react";
import styles from "./Tutorial.module.css";
import { Dumbbell, Clock, Target, Flame } from 'lucide-react';

const Tutorial = () => {
    const [step, setStep] = useState(0);
    const [doing, setDoing] = useState(false);

    const steps = [
        {
            question: "What's your fitness goal?",
            options: [
                { icon: <Dumbbell className="w-6 h-6 mb-2" />, text: "Build Muscle" },
                { icon: <Flame className="w-6 h-6 mb-2" />, text: "Lose Weight" },
                { icon: <Target className="w-6 h-6 mb-2" />, text: "Improve Strength" },
                { icon: <Clock className="w-6 h-6 mb-2" />, text: "Better Endurance" },
            ],
        },
        {
            question: "What's your experience level?",
            options: [
                { text: "Beginner", description: "New to working out" },
                { text: "Intermediate", description: "Some experience" },
                { text: "Advanced", description: "Regular workout routine" },
            ],
        },
        {
            question: "How often can you workout?",
            options: [
                { text: "2-3 times/week", description: "Casual" },
                { text: "3-4 times/week", description: "Regular" },
                { text: "5+ times/week", description: "Intensive" },
            ],
        },
    ];

    useEffect(() => {
        console.log(doing);
        setDoing(true);
        setTimeout(() => {
            setDoing(false);
        }, 3800)
    }, [step])

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Set localStorage
            localStorage.setItem("isNewUser", "1");

            // Dispatch custom event
            const event = new CustomEvent('tutorialComplete');
            window.dispatchEvent(event);

            alert("Tutorial Completed!");
        }
    };

    return (
        <div className={styles.tutorialOverlay}>
            <div className={styles.tutorialBox}>
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-md max-w-sm">
                    <div className="flex flex-col items-center justify-center">
                        {doing === true ? (
                            <img
                                src="/pepeWorkout.gif"
                                alt="Pepe Trainer"
                                className="w-35 h-20"
                            />
                        ) : (
                            <img
                                src="/pepe2.png"
                                alt="Pepe Trainer"
                                className="w-35 h-20"
                            />
                        )}
                        {/* <p className="text-gray-800 font-bold">Pepe Trainer</p> */}
                    </div>
                    <div className="mt-3">
                        <p className="text-gray-700 text-center">
                            {steps[step].question}
                        </p>
                    </div>
                </div>
                {/* <img
                    src="/pepeWorkout.gif"
                    alt="Cute Character"
                    className={styles.character}
                /> */}
                <div className={styles.content}>
                    {/* <h2>{steps[step].question}</h2> */}
                    <h2></h2>
                    <div className={styles.options}>
                        {steps[step].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={handleNext}
                                className={styles.optionButton}
                            >
                                {option.emoji} {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;