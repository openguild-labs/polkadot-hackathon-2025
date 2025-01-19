import Image from "next/image";
import logo from "@/public/Logo/IMG_7286.jpg";
import bg from "@/public/Logo/image.png";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-screen flex items-center justify-center "
    >
      <div className="flex flex-row gap-10 max-w-6xl w-full justify-between ">
        <div className="flex-1 flex flex-col gap-2 max-w-lg transition duration-500 ease-in-out transform hover:scale-110">
          <h1 className="text-4xl font-bold mb-4 text-[#A7B7DB]">
            Egalitarian Investing
          </h1>
          <span className="text-lg text-[#A7B7DB] font-extralight">
            <span className="font-bold">Launchpool</span> believes all project
            stakeholders are as important as each other. Investment funds and
            communities should work side by side on projects, on the same terms,
            towards the same goals.
          </span>
          <span className="text-lg mt-9 text-[#A7B7DB] font-extralight">
            <span className="font-bold">Launchpool</span> harnesses their
            strengths, and aligns their incentives, so that the sum is greater
            than its constituent parts.
          </span>
        </div>
        <div className="flex-2 flex justify-center items-center transition duration-500 ease-in-out transform hover:scale-110">
          <Image src={logo} alt="Logo" width={350} height={400} className="rounded-full" />
        </div>
      </div>
    </div>
  );
}
