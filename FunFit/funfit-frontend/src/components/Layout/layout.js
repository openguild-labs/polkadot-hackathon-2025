import Navbar from '../Header/index.js';
import Footer from '../Footer/index.js';
 
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}