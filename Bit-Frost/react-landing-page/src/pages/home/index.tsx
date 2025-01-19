import Navbar from './v2/Navbar';
import Banner from './v2/Banner';
// import { isMobile } from '../../utils/device';
import Dcl from './v3/Dcl';
import Footer from './v3/Footer';
import CardParalax from './section/AnC';
import Faq from './section/Faq';
import Team from './section/Team';
import Timeline from './section/Timeline';

const HomePage = () => {
  

  // const mobile = isMobile();
  return (
    <div className=" bg-black scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
      <header>
        <Navbar />
      </header>
      <div  className="">
        <section  className=" overflow-hidden">
          <Banner />
          {/* <Intro /> */}
          <Dcl />
        </section>
        <section>
          <CardParalax />
          <Timeline />
          <Team/>
          <Faq />
        </section>
      </div>
      <footer className="Home_footer flex justify-center">
        <Footer />
      </footer>
    </div>
  );
};

export default HomePage;
