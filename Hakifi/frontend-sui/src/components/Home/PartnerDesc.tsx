"use client";

/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useIsMobile } from "@/hooks/useMediaQuery";
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/Partner.module.scss";
import Button from "../common/Button";
import ArrowIcons from "../common/Icons/ArrowIcon";
import { InView } from "react-intersection-observer";
import stylesAnimate from "./styles/Animation.module.scss";
const dataSource = [
	{
		name: "Nami Exchange",
		title: "nami.exchange",
		content:
			"We integrated Hakifi into Nami's ecosystem because the idea was innovative and suited to our users' tastes.",
		img: "/assets/images/home/ic_partner_nami.png",
		icon: "/assets/images/home/nami.svg",
	},
	{
		name: "SCI Labs",
		title: "scilabs.io",
		content:
			"The utility of a price hedging protocol is undeniable. SCI Labs believes that Hakifi will develop more in the future.",
		img: "/assets/images/home/ic_partner_sci.png",
		icon: "/assets/images/home/sci.svg",
	},
	{
		name: "VNST",
		title: "vnst.io",
		content: "The concept of price hedging is simplified through Hakifi",
		img: "/assets/images/home/ic_partner_vnst.png",
		icon: "/assets/images/home/vnst.svg",
	},
];
const PartnerDesc = () => {
	const content = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const isMobile = useIsMobile();
	const timer = useRef<ReturnType<typeof setInterval>>();
	useEffect(() => {
		clearInterval(timer.current);
		timer.current = setInterval(() => {
			setIndex((index) => {
				return index >= dataSource.length - 1 ? 0 : index + 1;
			});
		}, 8000);
		return () => {
			clearInterval(timer.current);
		};
	}, []);
	const handleNext = () => {
		clearInterval(timer.current);

		setIndex((prevIndex) => {
			const newIndex = prevIndex < dataSource.length - 1 ? prevIndex + 1 : 0;

			timer.current = setInterval(() => {
				setIndex((index) => (index >= dataSource.length - 1 ? 0 : index + 1));
			}, 8000);

			return newIndex;
		});
	};
	const handlePrev = () => {
		clearInterval(timer.current);

		setIndex((prevIndex) => {
			const newIndex = prevIndex > 0 ? prevIndex - 1 : dataSource.length - 1;

			timer.current = setInterval(() => {
				setIndex((index) => (index >= dataSource.length - 1 ? 0 : index + 1));
			}, 8000);

			return newIndex;
		});
	};
	return (
		<section className="bg-primary-light bg-cover bg-no-repeat lg:bg-right bg-center overflow-hidden">
			<div className="lg:pb-20 pb-5">
				<div className="text-typo-primary uppercase lg:text-5xl text-[28px] text-center font-determination tracking-[1.68px] lg:tracking-[2.88px]">
					What our trusted clients <br />
					<InView>
						{({ inView, ref }) => (
							<div
								ref={ref}
								className={inView ? stylesAnimate.titleAnimation : ""}>
								{"say about Hakifi".split(" ").map((item, index) => (
									<span
										className={clsx({ "!text-typo-accent": index > 1 })}
										key={index}>
										{item}
									</span>
								))}
							</div>
						)}
					</InView>
				</div>

				<p className="text-typo-secondary  text-sm lg:text-base text-center lg:mt-5 mt-2">
					Hear stories from our trusted clients.
					<br />
					We always deliver the best results to our clients
				</p>
			</div>
			<div className="lg:px-6 px-0 h-full lg:my-20 lg:w-full w-[320px] flex items-center justify-center desktop-screen">
				<div
					ref={content}
					className="h-full lg:min-h-[380px] flex items-center flex-col justify-center lg:space-y-0 lg:gap-y-[60px] gap-y-[20px]">
					<div className={styles.wrapper}>
						{dataSource.map((item, i) => (
							<div
								key={i}
								className={clsx("border border-support-scroll rounded-[4px] ", {
									"flex flex-col w-full lg:h-2/3 justify-between relative":
										isMobile,
									[styles.active]: index === i,
									[styles.inactive]: index !== i,
								})}>
								<div className="rounded-[10px] lg:max-w-[100px] max-w-[60px] relative lg:-top-[50px] -top-[30px] lg:left-[calc(50%-50px)] left-[calc(50%-30px)]  bg-support-black border border-support-scroll">
									<img
										src={item.icon}
										alt=""
										className="h-[60px] w-[60px] lg:w-[100px] lg:h-[100px] px-2 py-2"
									/>
								</div>
								<div
									className={clsx(
										"lg:text-4xl text-base font-bold lg:w-[590px] text-support-white flex flex-col gap-y-5 items-center",
										{
											"lg:px-10 lg:pt-0 lg:pb-10 px-5 py-3": index === i,
											"lg:p-6 p-3": index !== i,
										}
									)}>
									<div
										className={clsx(
											"text-center font-medium text-typo-primary",
											{
												"lg:text-2xl text-base": index === i,
												"text-base": index !== i,
											}
										)}>
										“{item.content}”
									</div>
									<div
										className={clsx("text-typo-secondary", {
											"lg:text-[20px] text-base": index === i,
											"text-sm": index !== i,
										})}>
										{item.name}
									</div>
								</div>
							</div>
						))}
					</div>
					<Pagination total={dataSource.length} page={index} limit={1} />
					<div className="lg:flex hidden items-center justify-between w-full absolute desktop-screen">
						<Button
							size="sm"
							onClick={handlePrev}
							className="text-typo-secondary hover:text-typo-accent border border-divider-secondary bg-support-black w-10 h-10 hover:bg-background-secondary hover:border-background-primary px-2 rotate-180">
							<ArrowIcons />
						</Button>
						<Button
							size="sm"
							onClick={handleNext}
							className="text-typo-secondary hover:text-typo-accent border border-divider-secondary bg-support-black hover:bg-background-secondary w-10 h-10 hover:border-background-primary px-2">
							<ArrowIcons />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

interface PaginationType {
	limit: number;
	page: number;
	total: number;
}
const Pagination = ({ limit, page, total }: PaginationType) => {
	const totalPage = useMemo(() => Math.ceil(total / limit), [total, limit]);
	const renderDots = () => {
		const dot = [];
		for (let i = 0; i < totalPage; i++) {
			dot.push(
				<div
					key={i}
					className={clsx("rounded-xs !h-1 !transition-all", {
						"!w-6 !bg-typo-accent": i === page,
						"bg-typo-secondary !w-1 ": i !== page,
					})}
				/>
			);
		}
		return dot;
	};

	return (
		<div className={clsx("flex items-center space-x-2")}>{renderDots()}</div>
	);
};

export default PartnerDesc;
