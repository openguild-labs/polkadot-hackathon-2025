import React from 'react';
import Slider from 'rc-slider';
import { useIsTablet } from '@/hooks/useMediaQuery';
import colors from '@/colors';
import './slider.css'
import "rc-slider/assets/index.css";

type SliderRangerProps = {
    sliderProps?: { [key: string]: string | number; };
    color?: string;
    colorActive?: string;
    trackStyle?: any;
    isDisableMark?: boolean;
    value: number;
    onChange: (value: number) => void;
    railStyle?: React.CSSProperties;
    dotStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties);
    className?: string;
    activeDotStyle?: React.CSSProperties;
    positionLabel?: 'top' | 'bottom';
    marks: any;
    tooltip?: boolean;
    min?: number;
    max?: number;
    step?: number;
};
const SliderWrapper = ({
    sliderProps,
    // color = DEFAULT_COLOR,
    // colorActive = DEFAULT_COLOR_ACTIVE,
    isDisableMark = false,
    value,
    positionLabel = 'top',
    onChange,
    step,
    ...props
}: SliderRangerProps) => {

    return (
        <Slider
            // isMobile={isMobile}
            value={value}
            onChange={(value: number | any) => onChange(value)}
            // isDisableMark={isDisableMark}
            // positionLabel={positionLabel}
            // color={color}
            // colorActive={colorActive}
            // dots={true}
            step={step}
            handleStyle={{
                width: 20,
                height: 20,
                backgroundColor: colors.background.primary,
                border: 'none',
                top: 2,
                opacity: 1,
                zIndex: 2,
                boxShadow: 'none',
                borderRadius: 0
            }}

            dotStyle={
                {
                    width: 6, height: 12, bottom: -4, backgroundColor: colors.divider.secondary, borderColor: colors.background.tertiary, borderWidth: 2, borderRadius: 1
                }
            }
            activeDotStyle={
                {
                    width: 4, height: 12, bottom: -4, backgroundColor: colors.background.primary, borderColor: colors.typo.accent, color: colors.typo.accent
                }
            }
            railStyle={
                {
                    backgroundColor: colors.divider.secondary, height: 4, width: '101.5%',
                }
            }
            trackStyle={
                {
                    backgroundColor: colors.background.primary, height: 4, color: colors.typo.accent, left: '-1.5%'
                }
            }
            {...sliderProps}
            {...props}
        />
    );
};

export default SliderWrapper;