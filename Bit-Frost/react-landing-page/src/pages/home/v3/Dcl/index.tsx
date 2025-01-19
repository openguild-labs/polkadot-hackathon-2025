import React from 'react';
import {
  BannerArrowIcon,
  DclIcon1,
  DclIcon19,
  DclIcon2,
  DclIcon3,
  DclIcon4,
  DclIcon5
} from '../../../../components/layoutIcon/Icon';

type FeatureCardProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon  , title, description }) => (
  <div className="flex-1 mr-12 sm:w-full sm:mr-0 sm:mb-14 md:w-full lg:mb-6">
    <div className="flex justify-center sm:overflow-hidden md:scale-110 md:transform md:origin-center">
      <Icon />
    </div>
    <h1 className="mt-16 mb-2.5 text-32 gotham_font_bold text-left sm:mt-10 sm:text-center md:mt-10 md:text-left  md:text-26">
      {title}
    </h1>
    <p className="text-lg gotham_font_light md:text-base sm:text-center">{description}</p>
  </div>
);

const Dcl = () => {
  function learnMore() {
    window.open('https://Bifrostprotocol.medium.com/');
  }
  function addLiquidity() {
    window.open('https://Bifrostprotocol.medium.com/');
  }
  return (
    <div className="overflow-hidden w-screen">
          {/* <AnimatedCursor
      innerSize={8}
      outerSize={8}
      color='0, 255, 209'
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={5}
      clickables={[
        'a',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        'label[for]',
        'select',
        'textarea',
        'button',
        '.link',
      ]}
    /> */}
    <div className=' w-screen overflow-hidden '>.</div>
      <div className='h-96 hidden sm:block'></div>
      <div className="relative z-10 overflow-hidden mx-auto  lg:w-4/5 sm:w-full md:w-full lg:mt-20 xl:mt-20 2xl:mt-20 md:mt-20 sm:mt-72">
        <div className="relative z-10 overflow-hidden mb-16 sm:justify-center md:justify-center sm:w-full md:w-full sm:text-center sm:mb-11 md:text-center md:mb-11">
          <div className="relative mb-4 sm:w-full md:w-full">
            <div className="transform -translate-x-8 sm:hidden md:hidden">
              <DclIcon1 />
            </div>
            <p className=" bottom-2 left-0 text-white gotham_font_bold  text-46 ">
              Bifrost Engine
            </p>
          </div>
          <p className="text-white gotham_font_bold  text-26 sm:text-xl md:text-xl sm:px-4">
            Powerring Limitless cross chain liquidity flow.
          </p>
        </div>
        <div className="absolute top-16 transform md:left-0 md:top-16 ">
          <DclIcon2 />
        </div>
        <div className="lg:hidden md:hidden absolute left-0 -top-44 right-0 z-0">
          <DclIcon19 />
        </div>
        <div className="relative z-10  flex-wrap gap-14 justify-between items-baseline text-white mb-24 grid grid-cols-3 sm:grid-cols-1 sm:pl-4 sm:pr-4 sm:mb-0 md:px-6 md:mb-24 md:gap-6">
          <FeatureCard
            Icon={DclIcon3}
            title="Decentralized Bridging"
            description="Bifrost relies on Cutting Threshold signature scheme Frost, Making asset control completely decentralized"
          />
          <FeatureCard
            Icon={DclIcon4}
            title="Darkpools"
            description="Bifrost offers complete private execution of orders, preventing High value trades from being front-runned or vulnerable to value Extraction"
          />
          <FeatureCard
            Icon={DclIcon5}
            title="AI driven Interoperability"
            description="Natty AI, is Bifrost's own AI engine with a primary goal of making cross chain Interations more user friendly"
          />
        </div>
        <div className="relative flex justify-center mb-80 sm:mb-64 md:mb-64">
          <div className="absolute -top-44 z-0 sm:hidden md:-top-24">
            <img src="https://assets.ref.finance/images/dclIcon6.svg" alt="dclIcon6"></img>
          </div>
          <div className="absolute flex sm:block sm:w-full sm:pl-4 sm:pr-4 mb:block mb:w-full mb:pl-4 mb:pr-4">
            <div
              onClick={learnMore}
              className="flex items-center justify-center gotham_font_bold text-lg  mr-5 border border-primary hover:border-hightGreenColor px-10 rounded-lg cursor-pointer text-white h-14 font-extrabold w-max  sm:w-full md:w-fit sm:mb-6 md:mb-6 md:mt-6"
            >
              Learn more
            </div>
            <div
              onClick={addLiquidity}
              className="sm:hidden flex items-center justify-center gotham_font_bold bg-primary rounded-lg  cursor-pointer text-lg text-black h-14 px-10 font-extrabold w-max hover:bg-hightGreenColor sm:w-full md:w-fit md:mt-6 sm:px-2"
            >
              Dive Into Bifrost Verse{' '}
              <BannerArrowIcon className="ml-2 sm:transform sm:scale-75 sm:origin-left md:transform md:scale-75 md:origin-left sm:ml-1 md:ml-1" />
            </div>
            <div
              onClick={addLiquidity}
              className="lg:hidden md:hidden flex items-center justify-center gotham_font_bold bg-primary rounded-lg  cursor-pointer text-lg text-black h-14 px-10 font-extrabold w-max hover:bg-hightGreenColor sm:w-full md:w-fit md:mt-6 sm:px-2"
            >
              Dive Into Bifrost Verse{' '}
              <BannerArrowIcon className="ml-2 sm:transform sm:scale-75 sm:origin-left md:transform md:scale-75 md:origin-left sm:ml-1 md:ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dcl;
