import { useTransform, motion, MotionValue } from 'framer-motion';
import { useRef } from 'react';

const TokenUtility = ({ i, ImgUrl, progress }: { i: number; ImgUrl?: string , progress: MotionValue<number> }) => {
  const targetScale = 1 - ( (4 - i) * 0.05);
  const range = [i * .25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  const container = useRef(null);

  // const { scrollYProgress } = useScroll({
  //   target: container,

  //   offset: ['start end', 'start start']
  // });

  // const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const TokenUtilityPng = new URL('../../../assets/TokenUtility.png', import.meta.url).href;

  return (
    <div ref={container} className="text-white h-screen  flex sm:hidden justify-center sticky mt-40 top-36">
      <motion.div
        className={`w-5/6 border overflow-hidden z-20 bg-card-bg  border-opacity-30 flex justify-center h-4/6 items-center rounded-3xl  ${
          i === 1 ? 'CardShadowGradient' : ''
        } relative`}
        style={{scale , top: `calc(-5vh + ${i * 25}px)` }}
      >
          <img className='object-cover top-8' src={TokenUtilityPng}  alt="Token Utility" />
        {/* <motion.div  style={{ scale: imageScale }} className='object-cover'>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default TokenUtility;
