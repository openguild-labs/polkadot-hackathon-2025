import { Glow } from '@codaworks/react-glow';
import { useTransform, motion, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import frostImage from '../../../assets/frost.jpg';
import zkpImage from '../../../assets/zkp.png';
import teesImage from '../../../assets/tees.png';
import sssImage from '../../../assets/sss.png';

const Solution = ({ i, ImgUrl, progress }: { i: number; ImgUrl?: string; progress: MotionValue<number> }) => {
  const targetScale = 1 - (4 - i) * 0.05;
  const range = [i * 0.25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  const container = useRef(null);
  // const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] });
  // const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  // const [isFlipped, setIsFlipped] = useState(false);

  const Cardbg = new URL('../../../assets/Cardbg.png', import.meta.url).href;



  const cards = [
    { title: 'FROST', image: frostImage, description: 'Flexible Round-Optimized Schnorr Threshold Signatures. Enhances security and efficiency in multi-party cryptographic protocols.' },
    { title: 'Zkp', image: zkpImage, description: 'Zero-Knowledge Proofs and SPV ensures privacy and security in data sharing. Order details will not be exposed until it is executed' },
    { title: 'Tees', image: teesImage, description: 'Trusted Execution Environments for secure, isolated processing of sensitive data within decentralized systems.' },
    { title: 'SSS + atomic swaps', image: sssImage, description: 'Shamir Secret Sharing combined with atomic swaps for secure, cross-chain asset exchanges without intermediaries.' },
  ];

  return (
    <div ref={container} className="text-white h-screen flex justify-center sticky mt-40 top-36">
      <motion.div
        className={`w-5/6 border z-20 bg-card-bg border-opacity-30 flex justify-center h-4/6 items-center rounded-3xl ${
          i === 1 ? 'CardShadowGradient' : ''
        } relative`}
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
      >
        <div className="w-full px-32 xl:py-20 lg:py-16 md:py-16 md:px-16 sm:px-8 sm:py-10 h-full z-30 space-y-5 flex flex-col items-center overflow-hidden">
          <h1 className="xl:text-5xl lg:text-4xl md:text-4xl sm:text-3xl font-bold font-lexend bg-gradient-to-r from-gray-600 via-gray-50 to-gray-800 bg-clip-text text-transparent">
            Decentralized And Secure...
          </h1>
          <div className='xl:text-base lg:text-sm md:text-sm'>Bifrost solves crucial blockchain challenges using cutting-edge cryptography and distributed computing</div>
          <div className='w-full h-full'>
            <div className="flex xl:space-x-8 lg:space-x-0 lg:border xl:border-0 lg:rounded-lg xl:flex lg:flex md:hidden sm:hidden overflow-hidden">
              {cards.map((card, index) => (
                <Glow color="purple" key={index}>
                  <div className='w-56 h-full xl:border lg:border-0 xl:rounded-lg lg:rounded-none Faqbg'>
                        <div className='border-b px-4 py-2  font-bold border-opacity-50'>{card.title}</div>
                        <div className='px-4 py-2 font-light font-poppins'>{card.description}</div>
                  </div>
                </Glow>
              ))}
            </div>
            <div className='hidden md:flex sm:flex w-full flex-col h-full items-center justify-center'>
                <div className='flex w-full justify-between sm:flex-col items-center' >
                  <div className='w-56 sm:w-44 justify-center flex sm:px-2 sm:py-2 sm:text-sm border border-opacity-60 rounded-xl py-4 px-3 my-3 sm:my-2 Faqbg '>FROST</div>
                  <div className='w-56 sm:w-44 justify-center flex sm:px-2 sm:py-2 sm:text-sm border border-opacity-60 rounded-xl py-4 px-3 my-3 sm:my-2 Faqbg '>TEE + SXG</div>
                </div>
                <div className='flex w-full justify-between sm:flex-col items-center'>
                  <div className='w-56 sm:w-44 justify-center flex sm:px-2 sm:py-2 sm:text-sm border border-opacity-60 rounded-xl py-4 px-3 my-3 sm:my-2 Faqbg '>SHARDING</div>
                  <div className='w-56 sm:w-44 justify-center flex sm:px-2 sm:py-2 sm:text-sm border border-opacity-60 rounded-xl py-4 px-3 my-3 sm:my-2 Faqbg '>ZK PROOFS</div>
                </div>
            </div>
          </div>
        </div>
        <div className="absolute z-10 -bottom-14 w-full transform scale-y-75">
          <img src={Cardbg} className="w-full" alt="cardbg" />
        </div>
      </motion.div>
    </div>
  );
};

export default Solution;
