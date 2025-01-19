import Slider, { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.css";
const SliderCustom = (props: SliderProps) => {
	return <Slider {...props} />;
};
export default SliderCustom;
