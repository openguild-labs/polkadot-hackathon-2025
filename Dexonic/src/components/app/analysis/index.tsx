// import { HeatMapChart } from './components/heatmap-chart';
// import Banner from './components/homepage/banner';
// import Confluence from './components/homepage/confluence';
// import Header from './components/homepage/header';
// import IndicatorList from './components/homepage/indicator-list';
import HeatMapIndicator from './components/indicators/heatmap';

export default function AnalysisPage() {
    return (
        <div className="mx-auto h-full max-w-md bg-black">
            {/* <Header /> */}
            {/* <Banner /> */}
            {/* <IndicatorList /> */}
            {/* <Confluence /> */}
            <HeatMapIndicator />
        </div>
    );
}
