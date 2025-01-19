import colors from "@/colors";
import useDebounce from "@/hooks/useDebounce";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { informula } from "@/lib/informula";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import ceil from 'lodash/ceil';
import floor from 'lodash/floor';
import inRange from 'lodash/inRange';
import round from 'lodash/round';
import SliderWrapper from "rc-slider";
import 'rc-slider/assets/index.css';
import { useEffect, useMemo, useState } from "react";

const PADDING_SLIDER = {
    MIN: 26,
    MAX: 70,
};

type PClaimSliderProps = {
    p_market: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
};

const PClaimSlider = ({ min, max, onChange, p_market }: PClaimSliderProps) => {
    const { side, p_claim, periodChangeRatio } = useBuyCoverStore();
    const isTablet = useIsTablet();
    const ratios = useMemo(() => {
        if (!p_market) return { min: 0, max: 0 };
        if (side === ENUM_INSURANCE_SIDE.BEAR) {
            return {
                min: informula.calculateHedge(Math.abs(max - p_market), p_market),
                max: informula.calculateHedge(Math.abs(min - p_market), p_market),
            };
        }
        return {
            min: informula.calculateHedge(Math.abs(min - p_market), p_market),
            max: informula.calculateHedge(Math.abs(max - p_market), p_market),
        };
    }, [min, max, p_market, side]);
    const rmin = ceil(ratios.min * 100, 1);
    const rmax = floor(ratios.max * 100, 1);
    const getRClaim = () => {
        return side === ENUM_INSURANCE_SIDE.BEAR ? ratios.min * 0.995 : ratios.min * 1.005;
    };

    const [ratioClaim, setRatioClaim] = useState(getRClaim());

    useEffect(() => {
        if (!!periodChangeRatio && p_claim && !inRange(p_claim, min, max)) {
            setRatioClaim(ceil(getRClaim(), 3));
        }
    }, [periodChangeRatio, min, max]);

    const debouncedRClaim = useDebounce(ratioClaim, 100);

    useEffect(() => {
        if (!p_market || !debouncedRClaim) return;
        const negative = side === ENUM_INSURANCE_SIDE.BEAR ? -1 : 1;
        onChange(p_market + negative * debouncedRClaim * p_market);
    }, [p_market, debouncedRClaim, side]);

    const onChangeRatio = (value: number) => {
        let ratioClaim = value / 100;
        if (ratioClaim < ratios.min) ratioClaim = ratios.min;
        else if (ratioClaim > ratios.max) ratioClaim = ratios.max;
        setRatioClaim(ratioClaim);
    };

    let rstyleMin = (rmin / rmax) * 100;
    if (rstyleMin < PADDING_SLIDER.MIN) {
        rstyleMin = PADDING_SLIDER.MIN;
    } else if (rstyleMin > PADDING_SLIDER.MAX) {
        rstyleMin = PADDING_SLIDER.MAX;
    }

    const negative = useMemo(() => side === ENUM_INSURANCE_SIDE.BEAR ? -1 : 1, [side]);
    const marks = useMemo(() => {
        return {
            [rmin]: {
                label: negative * rmin + '%',
                style: {
                    fontSize: isTablet ? 12 : 14,
                }
            },
            [rmax]: {
                label: negative * rmax + '%',
                style: {
                    fontSize: isTablet ? 12 : 14,
                    transform: 'unset',
                    left: 'unset',
                    right: -6,
                },
            },
            [ratioClaim * 100]: {
                label: round(negative * ratioClaim * 100, 1) + '%',
                style: {
                    fontSize: isTablet ? 12 : 14,
                    color: colors.typo.accent,
                    fontWeight: 600,
                    background: colors.background.tertiary,
                    // zIndex: 1,
                    padding: '0 2px',
                },
            },
        };
    }, [negative, ratioClaim, rmin, rmax, isTablet]);

    useEffect(() => {
        // Get the button element
        const handle = document.querySelector('.rc-slider-handle');

        if (handle) {
            // Add a mouseover event listener
            handle.addEventListener('mouseover', () => {
                // Change the button's background color
                (handle as Element).classList.add("slider-tooltip");
            });

            // Add a mouseout event listener
            handle.addEventListener('mouseout', () => {
                // Change the button's background color back to its original color
                console.log("hover out");
                (handle as Element).classList.remove("slider-tooltip");
            });
        }

        return () => {
            if (handle) {
                // Add a mouseover event listener
                handle.removeEventListener('mouseover', () => {

                });

                // Add a mouseout event listener
                handle.removeEventListener('mouseout', () => {

                });
            }
        };
    }, []);

    return (
        <div className="relative pt-5 pb-1.5 mb-5">
            <div className="flex">
                <div style={{ width: `${rstyleMin}%` }} className="flex items-center">
                    <div className="h-3 w-1 rounded bg-background-quaternary absolute border-1 border-typo-tertiary left-1" />
                    <div className="h-1 flex-1 bg-background-quaternary" />
                </div>
                <div style={{ width: `${100 - rstyleMin}%` }} className="relative pr-1.5 p-claim-slider [&>.rc-slider-mark]:text-body-14 [&>.rc-slider-mark-text-active]:bg-background-tertiary [&>.rc-slider-mark-text-active]:z-20">
                    <SliderWrapper
                        defaultValue={round(negative * ratioClaim * 100, 1)}
                        min={rmin}
                        max={rmax}
                        marks={marks}
                        step={0.1}
                        railStyle={
                            {
                                backgroundColor: colors.divider.secondary, height: 4, width: '101.5%',
                            }
                        }
                        trackStyle={
                            {
                                backgroundColor: colors.support.slider, height: 4, color: colors.typo.accent,
                            }
                        }
                        handleStyle={{
                            width: 20,
                            height: 20,
                            backgroundColor: colors.background.primary,
                            top: 2,
                            opacity: 1,
                            zIndex: 2,
                            boxShadow: 'none',
                            borderRadius: 0,
                            border: 'none',
                        }}
                        dotStyle={
                            {
                                width: 4, height: 12, bottom: -4, backgroundColor: colors.divider.secondary, borderColor: colors.support.slider, borderWidth: 1, borderRadius: 1
                            }
                        }
                        activeDotStyle={{
                            background: colors.background.primary,
                        }}
                        value={ratioClaim * 100}
                        onChange={(value) => onChangeRatio(value as number)}
                    />
                </div>
            </div>
            <div className="absolute bottom-0 translate-y-full text-body-12 sm:text-body-14 text-typo-secondary">Market</div>
            <div style={{ left: `${rstyleMin}%` }} className="absolute bottom-0 translate-y-full -translate-x-1/2 text-body-12 sm:text-body-14 text-typo-secondary">
                {side === ENUM_INSURANCE_SIDE.BEAR ? 'Max' : 'Min'}
            </div>
            <div className="absolute bottom-0 right-0 translate-y-full text-body-12 sm:text-body-14 text-typo-secondary">
                {side === ENUM_INSURANCE_SIDE.BEAR ? 'Min' : 'Max'}
            </div>
        </div>
    );
};

export default PClaimSlider;