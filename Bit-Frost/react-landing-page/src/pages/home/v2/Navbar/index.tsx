/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { HiXMark } from 'react-icons/hi2';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const useSmoothScroll = () => {
  const executeScroll = useCallback((elementId: string)  => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return executeScroll;
};

const Navbar = () => {
  const logo = new URL('../../../../assets/logo.png', import.meta.url).href;
  const [opensideNav , setOpensideNav] = React.useState(false);
  const scrollToSection = useSmoothScroll();

  return (
    <div className="fixed  z-50 w-screen  flex justify-center pt-6">
      <div className=" w-11/12 py-5 backdrop-filter  backdrop-blur-3xl justify-between  text-white flex border border-gray-500 rounded-lg px-4 items-center">
        <div className="hidden md:block sm:block px-3" onClick={() => setOpensideNav(!opensideNav)}>
          <GiHamburgerMenu />
        </div>
        <div className="flex space-x-1 items-center">
          <div className="mr-2 text-32 gotham_font_bold sm:hidden">
            <img src={logo} alt="logo" className="w-12" />
          </div>
          <div className="font-bold text-2xl gotham_font">Bifrost BRIDGE</div>
        </div>
        <div className="flex space-x-3 font-bold text-gray-500 md:hidden sm:hidden cursor-pointer">
          <a className="hover:text-white" onClick={() => scrollToSection('home')}>
            Home
          </a>
          <a className="hover:text-white" onClick={() => scrollToSection('roadmap')}>
            Roadmap
          </a>
          <a className="hover:text-white" href='/aichat'>
            AI
          </a>
          <a className="hover:text-white" onClick={() => scrollToSection('faq')}>
            FAQ
          </a>
        </div>
        <Link className="text-md flex  px-5 py-1 rounded-xl glowButton sm:hidden" to="/swap">
          <p className="mr-2 font-bold py-1">Swap</p>
          <RiExternalLinkLine />
        </Link>
      </div>
      <div className={`z-50 Teambg  h-screen absolute transform transition-all duration-100 ${opensideNav ? 'w-screen' : 'w-0 hidden'}`}>
        <div className="flex flex-col justify-center items-center text-gray-200">
          <div className='text-2xl p-4 flex w-full justify-end'>
            <div className='p-4 border border-gray-400 rounded-lg hover:bg-gray-900' onClick={() => setOpensideNav(!opensideNav)}>
              <HiXMark />
            </div>
          </div>
          <a
            className="border-t border-b flex justify-center border-gray-300 border-opacity-30 w-full py-6 hover:bg-gray-800 cursor-pointer"
            onClick={() => {
              scrollToSection('home')
              setOpensideNav(!opensideNav)
            }}
          >
            Home
          </a>
          <a
            className="border-t border-b flex justify-center border-gray-300 border-opacity-30 w-full py-6 hover:bg-gray-800 cursor-pointer"
            onClick={() => {
              scrollToSection('roadmap')
              setOpensideNav(!opensideNav)
            }}
          >
            Roadmap
          </a>
          <a
            className="border-t border-b flex justify-center border-gray-300 border-opacity-30 w-full py-6 hover:bg-gray-800 cursor-pointer"
            onClick={() => {
              scrollToSection('team')
              setOpensideNav(!opensideNav)
            }}
          >
            Team
          </a>
          <a
            className="border-t border-b flex justify-center border-gray-300 border-opacity-30 w-full py-6 hover:bg-gray-800 cursor-pointer"
            onClick={() => {
              scrollToSection('faq')
              setOpensideNav(!opensideNav)
            }}
          >
            FAQ
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
