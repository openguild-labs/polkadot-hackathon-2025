import colors from "@/colors";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { useWallet } from "@suiet/wallet-kit";
import clsx from "clsx";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styles from "./Timeline.module.scss";

export interface TimelineProps {
	children: React.JSX.Element;
}

export interface TimelineItemProps {
	date: number | string | React.JSX.Element;
	side: "left" | "right";
	title: string;
	content: string;
	isButton?: boolean;
}

const MOBILE_LINE = 1055;

export const Timeline: React.FC<TimelineProps> = ({ children, ...rest }) => {
	const [borderHeight, setBorderHeight] = useState(0);
	const { configuredWallets } = useWallet();
	const listedWallets = useMemo(() => {

		return configuredWallets.filter(item => item.installed);
	}, [configuredWallets]);

	const isMobile = useIsTablet();
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const maxHeight = isMobile ? 2500 : 1850;
			const contentHeight = isMobile ? MOBILE_LINE + listedWallets.length * 70 : 1746;
			let height = 0;
			if (scrollTop - maxHeight > contentHeight) {
				height = contentHeight;
			} else if (scrollTop - maxHeight < 0) {
				height = 0;
			} else {
				height = scrollTop - maxHeight;
			}
			setBorderHeight(height);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMobile]);
	return (
		<div className="relative">
			<div className="w-2.5 h-2.5 relative top-0 lg:left-[calc(50%-5px)] rounded-b-md border-l-[5px] border-r-[5px] border-background-primary z-10"></div>
			<div {...rest} className={clsx(styles.timeline)}>
				{children}
			</div>
			<div
				className={styles.line}
				style={{
					height: borderHeight,
					borderColor:
						borderHeight > 0
							? colors.background.primary
							: colors.divider.secondary,
					zIndex: 3,
				}}
			/>
			<div
				className={styles.line}
				style={{
					height: isMobile ? MOBILE_LINE + listedWallets.length * 70 : 1746,
					borderColor: colors.divider.secondary,
					zIndex: 1,
				}}
			/>
		</div>
	);
};

export const TimelineItem: React.FC<TimelineItemProps> = (props) => {

	const { configuredWallets } = useWallet();
	const listedWallets = useMemo(() => {

		return configuredWallets.filter(item => item.installed);
	}, [configuredWallets]);

	const { date, side, title, content, isButton } = props;
	const [inView, setInView] = useState(false);
	const [borderHeight, setBorderHeight] = useState(0);
	const isMobile = useIsTablet();
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const maxHeight = isMobile ? 2500 - (listedWallets.length + 1) * 100 : 1850;
			const contentHeight = isMobile ? 1470 : 1746;
			let height = 0;
			if (scrollTop - maxHeight > contentHeight) {
				height = contentHeight;
			} else if (scrollTop - maxHeight < 0) {
				height = 0;
			} else {
				height = scrollTop - maxHeight;
			}
			setBorderHeight(height);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMobile]);
	useEffect(() => {
		const handleIntersection = (
			entries: IntersectionObserverEntry[],
			observer: IntersectionObserver
		) => {
			const [entry] = entries;
			setInView(entry.isIntersecting);
			if (isButton && entry.isIntersecting) {
				observer.unobserve(entry.target);
			}
		};
		const observer = new IntersectionObserver(handleIntersection, {
			root: null, // observing viewport
			rootMargin: "0px",
			threshold: isButton ? 0.2 : 0.8,
		});

		const currentRef = ref.current;

		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [isButton]);

	const ref = useRef<HTMLDivElement>(null);
	const renderImage = useCallback(() => {
		let imageName = "disable";
		if (isMobile) {
			if (borderHeight >= 1465 && isButton && inView) {
				imageName = "active";
			} else if (inView && borderHeight < 1465 && !isButton) {
				imageName = "active";
			} else {
				imageName = "disable";
			}
		} else {
			imageName = inView ? "active" : "disable";
		}
		return (
			<img
				src={`/assets/images/home/${imageName}.png`}
				className={clsx(styles.dot, "absolute size-5 dot")}
				alt={imageName}
			/>
		);
	}, [inView, borderHeight, isButton]);
	return (
		<div
			className={clsx(
				styles.container,
				side === "left" ? styles.left : styles.right,
				"before:border before:border-dashed",
				{
					"before:border-background-primary before:top-[calc(10%+20px)]":
						inView,
					"before:border-divider-secondary ": !inView,
				}
			)}
			ref={ref}>
			{renderImage()}
			<div
				className={clsx(styles.date, styles[side], {
					"border-background-primary": inView,
					"border-background-tertiary": !inView,
					"border w-max": isButton === false,
				})}>
				{date}
			</div>
			{isButton === true ? null : (
				<div
					className={`${styles.content} ${inView
						? "border border-t-8 border-l-1 border-r-1 border-b-1 border-background-primary"
						: "border border-t-8 border-l-1 border-r-1 border-b-1 border-divider-secondary"
						} rounded-md h-[110px] lg:h-max`}>
					<div>
						<p
							className={clsx(
								"lg:text-3xl text-sm font-determination uppercase",
								{
									"text-typo-accent": inView,
									"text-typo-primary": !inView,
								}
							)}>
							{title}
						</p>
						<p
							className={clsx("font-saira lg:text-base text-xs lg:mt-4 mt-1", {
								"text-typo-primary": inView,
								"text-typo-disable": !inView,
							})}>
							{content}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Timeline;
