import AdminManage from "@/components/admin-manage";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-2 md:p-8">
      <Navbar />
      <AdminManage />
    </div>
  );
}
