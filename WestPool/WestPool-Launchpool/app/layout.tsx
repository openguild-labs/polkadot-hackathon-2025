import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { Layout } from "@/app/components/Layout";
import Footer from "./components/Footer";

import w1 from "@/public/Wireframe J 1.png";
import w2 from "@/public/Wireframe J 2.png";
import bg from "@/public/My project.png";

import Image from "next/image";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lauchpool Project",
  description: "Hackathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <html lang="en">
      <body
        className={inter.className}
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <Layout>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
            }}
          >
            <Image
              src={bg}
              alt="background"
              fill
              style={{ objectFit: "cover" }}
              quality={100}
            />
          </div>

          <Navbar />
          {children}
          <Footer />
        </Layout>
      </body>
    </html>
    // </QueryClientProvider>
  );
}

{
  /* <body
        className={inter.className}
        style={{
          background: "linear-gradient(to bottom, #101932, #304B96)",
        }}
      >
        <Layout>
          <Navbar />
          {children}
          <Footer />
        </Layout>
      </body> */
}

{
  /* <body
        className={inter.className}
        style={{
          background: "linear-gradient(to bottom, #101932, #304B96)",
          position: "relative",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <Layout>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-[spin_20s_linear_infinite]">
              <Image
                src={w2}
                alt="Top Left"
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 animate-[spin_20s_linear_infinite]">
              <Image
                src={w1}
                alt="Bottom Right"
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>


            <Image
              src={w2}
              alt="Top Left"
              className="absolute top-0 left-0 w-[600px] h-[500px] transform scale-100 animate-[pulse_3s_infinite]"
            />
            <Image
              src={w1}
              alt="Bottom Right"
              className="absolute bottom-0 right-0 w-[600px] h-[500px] transform scale-100 animate-[pulse_5s_infinite]"
            />


          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Navbar />
            {children}
            <Footer />
          </div>
        </Layout>
      </body> */
}
