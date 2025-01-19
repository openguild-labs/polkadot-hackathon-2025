import { useTransform, useScroll, motion, MotionValue } from "framer-motion";
import { useRef, useMemo } from "react";

const AiCard = ({
  i,
  ImgUrl,
  progress,
}: {
  i: number;
  ImgUrl?: string;
  progress: MotionValue<number>;
}) => {
  const targetScale = 1 - (4 - i) * 0.05;
  const range = [i * 0.25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  const Cardbg = new URL("../../../assets/Cardbg.png", import.meta.url).href;
  // const bot = new URL('../../../assets/botImage-left.png', import.meta.url).href;
  const eve = new URL("../../../assets/Everight.png", import.meta.url).href;

  return (
    <div
      ref={container}
      className="text-white h-screen flex justify-center sticky mt-40 top-36"
    >
      <motion.div
        className={`w-5/6 border z-20 bg-card-bg border-opacity-30 flex justify-center h-4/6 items-center rounded-3xl ${
          i === 1 ? "CardShadowGradient" : ""
        } relative`}
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
      >
        <div className="w-full  h-full z-30  flex flex-col items-center overflow-hidden">
          <h1 className=" xl:px-32  xl:pt-20 lg:px-16 lg:pt-9 md:px-8 md:pt-14 sm:px-8 sm:pt-10  xl:text-5xl lg:text-3xl md:text-2xl sm:text-2xl font-bold font-lexend bg-gradient-to-r from-gray-600 via-gray-50 to-gray-800 bg-clip-text text-transparent">
            AI ENHANCED CROSS CHAIN SWAPS
          </h1>
          <div className="xl:px-32 lg:px-24 md:px-10 sm:px-8  flex justify-between items-center h-full w-full  text-gray-200">
            <div className="space-y-4 text-center">
              <p>
                Introducing our cutting-edge AI model that empowers your crypto
                trades. Seamlessly place limit orders, stay updated with
                real-time crypto news, and access crucial market indicators, all
                through intuitive commands. Built using advanced LLM technology,
                our AI not only analyzes the market but also executes trades
                based on your specific needs.
              </p>
              <p className="md:hidden lg:flex flex">
                Whether you're monitoring price movements or ready to make a
                move, our AI model is your trusted assistant in navigating the
                crypto market with precision and ease.
              </p>
            </div>
            <div>
              <motion.div
                style={{ scale: imageScale }}
                className="w-56 -mr-10 flex sm:hidden animate-bounce z-20"
              >
                <img
                  src={eve}
                  className="mt-14 rounded-lg"
                  alt="AI-assisted trading"
                />
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute z-10 -bottom-14 w-full transform scale-y-75">
          <img src={Cardbg} className="w-full" alt="card background" />
        </div>
      </motion.div>
    </div>
  );
};

export default AiCard;
