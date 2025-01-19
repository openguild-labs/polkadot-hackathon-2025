import React, { useState } from 'react';
import { BannerArrowIcon } from '../../../../components/layoutIcon/Icon';
import './index.scss';
// import { isMobile } from '../../../../utils/device';
import useAnimateNumber from 'use-animate-number';
import Spline from '@splinetool/react-spline';
import { RiShieldKeyholeFill } from 'react-icons/ri';
import WaitlistModal from '../../WaitlistModal'; // Ensure this import path is correct

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mobile = window.screen.width <= 599.98;

  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative sm:mt-12 md:mt-12 pr-10 sm:pr-0 z-10 h-screen" id="home">
      <div
        className="absolute  text-transparent w-screen h-screen sm:flex md:hidden hidden"
      >
        <img src="https://cdn.dribbble.com/users/192882/screenshots/4659605/dribbble-animation.gif" className='object-cover' alt="" />
      </div>
      {!mobile && (
        <div className="absolute w-3/4 h-screen z-2 -left-32 xl:top-10 md:flex sm:hidden">
          <Spline
            className="bg-transparent h-5/6 2xl:h-2/3 z-2"
            scene="https://prod.spline.design/8glM91b9bsfBLBim/scene.splinecode"
          />
        </div>
      )}
      <div className="relative z-40 flex left-1/2 sm:left-0 sm:justify-center mx-auto sm:w-full h-5/6 2xl:h-2/3 items-center">
        <div className="flex flex-col sm:justify-center md:justify-center text-white mt-44 sm:mt-0  md:mt-0">
          <div>
            <span className=" xl:hidden 2xl:hidden lg:hidden md:flex sm:flex bg-gradient-to-r from-gray-600 via-gray-50 to-gray-50 bg-clip-text text-transparent gotham_font_bold" style={{ fontSize: '32px' }}>
              Where Privacy
            </span>
            <span className=" xl:hidden 2xl:hidden lg:hidden md:flex sm:flex bg-gradient-to-r from-gray-600 via-gray-50 to-gray-50 bg-clip-text text-transparent gotham_font_bold" style={{ fontSize: '32px' }}>
              Meets Security
            </span>
            <span className=" xl:text-5xl lg:text-3xl leading-10 bg-gradient-to-r from-gray-600 via-gray-50 to-gray-50 bg-clip-text text-transparent gotham_font_bold xl:flex  sm:hidden md:hidden" >
              Where Privacy Meets Security
            </span>
            <div className="flex space-x-4 xl:text-5xl py-3 lg:text-3xl sm:text-5xl" >
              <div className="text-hightGreenColor font-bold font-serif">Bifrost</div>
              <div>Starts...</div>
            </div>
          </div>
          <div
            onClick={openModal}
            className="flex items-center gotham_font_bold justify-center bg-primary rounded-lg cursor-pointer text-lg text-black h-14 font-extrabold w-max px-12 hover:bg-hightGreenColor sm:text-sm md:text-sm sm:h-10 md:h-10 sm:px-3.5 md:px-3.5"
            style={{ zIndex: 50 }} // High z-index to ensure it is on top
          >
            Join Waitlist{' '}
            <BannerArrowIcon className="ml-2 sm:transform sm:scale-75 sm:origin-left md:transform md:scale-75 md:origin-left sm:ml-1 md:ml-1" />
          </div>
        </div>
      </div>

      <div className="absolute z-40 flex    sm:mt-32  sm:flex-col justify-around mx-auto w-screen sm:w-full sm:px-5 ">
        <div className="flex flex-col items-center rounded-2xl sm:p-5 sm:my-5 md:my-5">
          <span className="text-mobile text-2xl sm:text-2xl md:text-xl gotham_font_bold">Low Fees</span>
          <span className="text-white gotham_font_bold text-42 my-2 md:text-4xl">
            <FeeNumber /> {'%'}
          </span>
          <span className="text-white text-base">Bifrost’s Order Fees</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl sm:p-5 sm:my-5 md:my-5">
          <span className="text-mobile text-2xl sm:text-2xl md:text-xl gotham_font_bold">Lightning Fast</span>
          <span className="text-white gotham_font_bold text-42 my-2 md:text-4xl">
            {'5-'}
            <FastNumber />
            {'S'}
          </span>
          <span className="text-white text-base">Bridging Speed</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl sm:p-5 md:px-5 sm:my-5 md:my-5">
          <span className="text-mobile text-2xl sm:text-2xl md:text-xl gotham_font_bold">Dark Pools</span>
          <span className="text-white gotham_font_bold text-46 my-4 md:text-4xl">
            <RiShieldKeyholeFill />
          </span>
          <span className="text-white text-base md:hidden">Decentralized Private Computation</span>
          <span className="text-white text-base text-center sm:hidden lg:hidden">
            Decentralized <br />
            Private Computation
          </span>
        </div>
      </div>
      {isModalOpen && <WaitlistModal onClose={closeModal} onSubmit={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Banner;

function FeeNumber() {
  const [value, ] = useAnimateNumber(0.1, {
    decimals: 2
  });
  return <>{value}</>;
}
function FastNumber() {
  const [value, ] = useAnimateNumber(10, {
    decimals: 1
  });
  return <>{value}</>;
}
// function GrowNumber(props: any) {
//   const [value, ] = useAnimateNumber(+props.num, {
//     decimals: 1
//   });
//   return <>{value}</>;
// }