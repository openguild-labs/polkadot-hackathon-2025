import Deposit from "@/components/deposit";
import Mint from "@/components/mint";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-2 md:p-8">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Deposit />
        <Mint />
      </div>
    </div>
  );
}
