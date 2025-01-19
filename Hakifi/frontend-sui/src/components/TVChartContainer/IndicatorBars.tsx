import { cn } from '@/utils';
import FullScreenIcon from '../common/Icons/FullScreenIcon';
import IndicatorIcon from '../common/Icons/IndicatorIcon';
import { mainIndicators, subIndicators } from './constantsTrading';

type IndicatorBarsProps = {
    onChangeIndicator: (key: string, val: string) => void;
    mainIndicator: any;
    subIndicator: any;
    fullScreen: boolean;
    setFullScreen: (e: boolean) => void;
    onShowIndicator: () => void;
    isDetail: boolean;
    isMobile: boolean;
    onRefreshChart: VoidFunction;
};

const IndicatorBars = ({ onRefreshChart, onChangeIndicator, mainIndicator, subIndicator, fullScreen, setFullScreen, onShowIndicator, isDetail, isMobile }: IndicatorBarsProps) => {
    const setIndicator = (item: string, key: string) => {
        let value = '';
        if (key === 'main') {
            value = mainIndicator === item ? '' : item;
        } else {
            value = subIndicator === item ? '' : item;
        }
        onChangeIndicator(key, value);
    };

    return (
        <div className={cn("h-10 flex items-center justify-between bg-background-tertiary border-t border-divider-secondary", fullScreen && "px-4")}>
            <div className="flex items-center text-body-14 text-typo-secondary justify-between w-full">
                <IndicatorIcon onClick={onShowIndicator} className="size-5" />
                {mainIndicators.map((item) => (
                    <div key={item.value} className={cn(mainIndicator === item.value && 'text-typo-primary')} onClick={() => setIndicator(item.value, 'main')}>
                        {item.label}
                    </div>
                ))}
                <div className="bg-divider-secondary w-[2px] h-4" />
                {subIndicators.map((item) => (
                    <div key={item.value} className={cn(subIndicator === item.value && 'text-typo-primary')} onClick={() => setIndicator(item.value, 'sub')}>
                        {item.label}
                    </div>
                ))}
                {isMobile && (
                    <FullScreenIcon onClick={() => setFullScreen(!fullScreen)} className="size-5" />
                )}
                {/* {
                    <RefreshIcon className="size-6" onClick={onRefreshChart} />
                } */}
            </div>
        </div>
    );
};

export default IndicatorBars;
