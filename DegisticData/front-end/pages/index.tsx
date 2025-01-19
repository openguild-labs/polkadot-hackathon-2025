import DefaultLayout from "@/layouts/default";
import { Navbar } from "@/components/home/navbar";
import { Banner } from "@/components/home/banner";
import { ABout } from "@/components/home/about";
import { Services } from "@/components/home/services";
import { SupplyChain } from "@/components/home/supplyChain";
import { Solution } from "@/components/home/solution";
import { Insurance } from "@/components/home/insurance";
import { Resource } from "@/components/home/resource";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Navbar />
      <Banner />
      <ABout />
      <Services />
      <SupplyChain />
      <Solution />
      <Insurance />
      <Resource />
    </DefaultLayout>
  );
}
