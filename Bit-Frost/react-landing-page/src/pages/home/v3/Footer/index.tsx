import { useState } from 'react';
import WaitlistModal from '../../WaitlistModal';
import {
  FooterIcon2,
  FooterIcon3,
  FooterIcon4,
  DclIcon18,
} from '../../../../components/layoutIcon/Icon';
import './index.scss';
import { FooterLink } from '../../../../components/common/FooterLink';
import { IconLink } from '../../../../components/common/FooterIconLink';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEmailSubmit = async (email: any) => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwHtpBuh2yxIh5afSsf2-Dy5kpESBPogKrpx1B76V9e5uKG7vZl04rCBElPpOV1lg7Nfg/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email }).toString(),
      });

      if (response.ok) {
        setEmails([...emails, email as never]);
        console.log('Stored Emails:', emails);
        alert('Email successfully stored!');
      } else {
        console.error('Failed to store email:', response.statusText);
        alert('Failed to store email. Please try again later.');
      }
    } catch (error) {
      console.error('Error storing email:', error);
      alert('Error storing email. Please try again later.');
    }
  };


  return (
    <div className="mx-auto lg:w-5/6 sm:w-full md:w-full mb-10 sm:px-9 sm:mb-8 md:mb-8 bg-black">
      <div className="flex justify-center mb-32 sm:mt-20 md:mt-20">
        <div
          onClick={handleOpenModal}
          className=" gotham_font_bold flex items-center font-extrabold text-lg justify-center bg-primary rounded-lg px-14 cursor-pointer text-black h-16 w-max hover:bg-hightGreenColor"
        >
          Join Waitlist
        </div>
        
      </div>  

        <div className="flex justify-between text-base text-white mb-16 sm:flex-wrap sm:mb-0 md:flex-wrap md:mb-0 px-4">
          <div className="sm:w-1/2 md:w-1/3 md:pl-20">
            <h1 className="gotham_font_bold mb-4">Read</h1>
            <FooterLink href="https://github.com/Bifrost-Labs">Whitepaper</FooterLink>
            <FooterLink href="https://Bifrostlabs.medium.com/">Blog</FooterLink>
          </div>
          <div className="sm:w-1/2 sm:pl-12 md:w-1/3 md:pl-16">
            <h1 className="gotham_font_bold  mb-4 ">Engage</h1>
            <FooterLink href="https://discord.gg/fBNwhSTc">Discord</FooterLink>
            <FooterLink href="https://x.com/Bifrost">X</FooterLink>
            <FooterLink href="https://t.me/Bifrost_labs">Telegram</FooterLink>
          </div>

          <div className="sm:w-1/2 sm:mt-6 md:w-1/3 md:pl-10">
            <h1 className="gotham_font_bold  mb-4 whitespace-nowrap">Goto</h1>
            <FooterLink href="#">Home</FooterLink>
            <FooterLink href="#team">Team</FooterLink>
          </div>
          <div className="sm:w-1/2 sm:mt-6 sm:pl-12 md:w-1/3 md:pl-20">
            <h1 className="gotham_font_bold  mb-4 whitespace-nowrap">Learn More</h1>
            <FooterLink href="#">Docs</FooterLink>
            <FooterLink href="https://github.com/Bifrost-Labs">Github</FooterLink>
            <FooterLink href="#">Forum</FooterLink>
            <div className="lg:hidden md:hidden">
              <FooterLink href="#">Bug Bounty</FooterLink>
            </div>
            <div className="lg:hidden md:hidden">
              <FooterLink href="#">Security</FooterLink>
            </div>
            <div className="lg:hidden md:hidden">
              <FooterLink href="#">Risks</FooterLink>
            </div>
          </div>
          <div className="sm:w-7/12 sm:-mt-24 md:w-1/3 md:pl-16">
            <h1 className="gotham_font_bold  mb-4">Business</h1>
            <FooterLink href="mailto:hello@Bifrostprotocol.xyz">Careers</FooterLink>
            <FooterLink href="mailto:hello@Bifrostprotocol.xyz">
              Contact Us
            </FooterLink>
          </div>
          <div className="w-1/3 flex flex-col mt-10 lg:hidden sm:hidden md:pl-10">
            <div className="block">
              <FooterLink href="Bug Bounty">Bug Bounty</FooterLink>
            </div>
            <div className="block">
              <FooterLink href="Security">Security</FooterLink>
            </div>
            <div className="block">
              <FooterLink href="Risks">Risks</FooterLink>
            </div>
          </div>
          <div className="sm:w-full sm:mt-6 md:w-full md:mt-20">
            <h1 className="gotham_font_bold  mb-7 sm:hidden md:hidden">Community</h1>
            <div className="flex justify-center items-center mb-7 sm:px-6 md:mb-4">
              <IconLink className="mr-4" IconComponent={DclIcon18} href="https://x.com/Bifrost" />
              <IconLink className="mx-4" IconComponent={FooterIcon2} href="https://t.me/Bifrost_labs" />
              <IconLink className="mx-4" IconComponent={FooterIcon3} href="https://discord.gg/fBNwhSTc" />
              <IconLink className="ml-4" IconComponent={FooterIcon4} href="https://Bifrostprotocol.medium.com" />
            </div>

            <div className="flex justify-between items-center md:hidden">
              <div className="sm:hidden">
                <FooterLink href="Bug Bounty">Bug Bounty</FooterLink>
              </div>
              <div className="sm:hidden">
                <FooterLink href="Security">Security</FooterLink>
              </div>
              <div className="sm:hidden">
                <FooterLink href="Risks">Risks</FooterLink>
              </div>
            </div>
            <div className="text-white text-13 float-right sm:flex md:flex sm:justify-center md:justify-center sm:items-center md:items-center sm:float-none md:float-none">
              @ 2024 Bifrost bridge
            </div>
          </div>
        </div>
        {showModal && (
        <WaitlistModal onClose={handleCloseModal} onSubmit={handleEmailSubmit} />
      )}
      </div>

    );
  };

  export default Footer;
