import MarketOverview from "./component/MarketOverview";
import BannerMarket from "./component/BannerMarket";
import MarketTable from "./component/MarketTable";

export default function MarketPage() {
  return (
    <main className="overflow-hidden 2xl:mx-[240px]">
      <BannerMarket />
      <div className="px-5">
        <MarketOverview />
        <MarketTable />
      </div>
    </main>
  );
}
