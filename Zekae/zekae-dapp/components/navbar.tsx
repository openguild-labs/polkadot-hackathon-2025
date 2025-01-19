import Link from "next/link";
import SigpassKit from "@/components/sigpasskit";

export default function Navbar() {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between w-full gap-4">
      <Link className="text-sm underline underline-offset-4" href="/">
        Home
      </Link>
      <SigpassKit />
    </div>
  );
}
