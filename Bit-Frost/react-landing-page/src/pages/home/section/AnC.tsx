import Lenis from "@studio-freight/lenis";
import { useScroll } from "framer-motion";
import React, { useEffect, useRef } from "react";
import AiCard from "../../../components/Card/FeatureCards/AiCard";
import Sharing from "../../../components/Card/FeatureCards/sharing";
import Solution from "../../../components/Card/FeatureCards/Solution";
import TokenUtility from "../../../components/Card/FeatureCards/TokenUtility";



const CardParalax = () => {

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  useEffect( () => {
    const lenis = new Lenis()
    function raf(time : number) {
      lenis.raf(time)

      requestAnimationFrame(raf)

    }
    requestAnimationFrame(raf)
  })

  return (
    <div ref={container} className="w-full relative">
      <Sharing i={1}  progress={scrollYProgress} />
      <Solution  i={2}  progress={scrollYProgress}/>
      <AiCard i={3}  progress={scrollYProgress}/>
      <TokenUtility i={4}  progress={scrollYProgress}/>
    </div>
  );
};

export default CardParalax;
