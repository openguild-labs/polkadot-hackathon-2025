import { useTransform, useScroll, motion, MotionValue } from 'framer-motion';
import { useRef } from 'react';

const Sharing = ({ i, progress }: { i: number; progress: MotionValue<number> }) => {
  const targetScale = 1 - (4 - i) * 0.05;
  const range = [i * 0.25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,

    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  const Cardbg = new URL('../../../assets/Cardbg.png', import.meta.url).href;
  const AnCGif = new URL('../../../assets/bridge.png', import.meta.url).href;

  return (
    <div ref={container} className="text-white  h-screen  flex justify-center sticky mt-40 top-36 ">
      <motion.div
        className={`w-5/6 border  z-20 bg-card-bg  border-opacity-30 flex justify-center h-4/6 items-center rounded-3xl  ${
          i === 1 ? 'CardShadowGradient' : ''
        } `}
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
      >
        <div className='w-full h-full relative overflow-hidden'>
        <div className="w-full xl:px-32 2xl:px-32 xl:py-14 lg:px-16 lg:py-9 md:px-8 md:py-14 sm:px-8 sm:py-10 h-full z-30 space-y-5">
          <h1 className="text-growingColor xl:text-5xl lg:text-3xl md:text-2xl font-bold font-lexend sm:text-4xl">Asset and Context Sharing</h1>
          <div className="xl:text-2xl lg:text-xl md:text-lg text-gray-400 sm:text-2xl">Unifying Assets and Logic Across Chains</div>
          <div className="xl:w-3/5 lg:w-8/12 text-xl lg:text-lg text-gray-200 z-30 md:w-8/12 md:text-base sm:text-base sm:w-full" style={{ zIndex : '100'}}>
             Protocol enables seamless cross-chain asset transfers and shared context across diverse networks.
            Users can move entire financial positions, preserving complex DeFi states between chains. Our technology
            facilitates cross-chain contract calls, allowing smart contracts to interact across different blockchains.
            This creates a fluid ecosystem where capital efficiency is maximized and DeFi innovation transcends
            individual chain limitations.
          </div>
        </div>
        <motion.div style={{ scale: imageScale }} className="absolute z-20 bottom-10 right-16 lg:bottom-8 lg:right-12 md:bottom-6 md:right-10 overflow-hidden">
          <img src={AnCGif} className="xl:w-bridgewidth 2xl:w-bridgewidth lg:w-bridgewidth-lg md:w-96 sm:w-0 rounded-lg" alt="Asset and Context sharing" />
        </motion.div>
        <div className="absolute z-10 -bottom-14 w-full transform scale-y-75">
          <img src={Cardbg} className="w-full" alt="cardbg" />
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sharing;
