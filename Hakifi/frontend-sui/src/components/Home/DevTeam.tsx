"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";

const TeamElement = ({
	item,
}: {
	item: {
		name: string;
		title: string;
		img: string;
	};
}) => {
	return (
		<div
			className={clsx(
				"flex flex-col items-center justify-center col-span-1 p-0 hover:shadow-card2 bg-transparent cursor-pointer"
			)}>
			<div className="w-[195px] h-[205px]  md:h-[288px] md:w-[294px]">
				<Image
					width={200}
					height={200}
					className="lg:object-cover object-fit w-[195px] h-[205px] md:h-[288px] md:w-[294px] opacity-100"
					src={item.img}
					alt={item.name}
				/>
			</div>
			<div className="mt-4 sm:mt-4 w-full px-4">
				<p
					className={clsx(
						"uppercase text-xl w-full lg:tracking-[1.68px] text-center tracking-[0.8px] font-medium whitespace-nowrap lg:leading-[42px] font-determination transition-all text-typo-primary"
					)}>
					{item.name}
				</p>
				<div className="text-xs w-full sm:text-sm mt-2 text-typo-secondary font-medium break-words text-center">
					{item.title}
				</div>
			</div>
		</div>
	);
};

const AdvisorTab = () => {
	const dataSource = [
		{
			name: "Dai",
			title: "Founder",
			img: "/assets/images/home/ic_mr_dai.png",
		},
		{
			name: "Tule",
			title: "CTO",
			img: "/assets/images/home/ic_mr_chau.png",
		},
		{
			name: "Ethan",
			title: "Co-Founder/CEO",
			img: "/assets/images/home/ic_mr_cuong.png",
		},
		{
			name: "Kevin",
			title: "Head of Experience",
			img: "/assets/images/home/ic_kevin.png",
		},
		{
			name: "Vian",
			title: "Partner Manager",
			img: "/assets/images/home/ic_vivian.png",
		},
	];
	return (
		<div className="flex flex-col items-center justify-center w-full gap-y-6 lg:gap-y-[76px]">
			<div className="flex items-center flex-col gap-y-5 py-[22px] px-6 bg-transparent box-radius lg:h-[124px] w-full">
				<div className="text-3xl sm:text-5xl text-center font-bold lg:w-1/3 w-full text-typo-primary font-determination uppercase">
					Our team
				</div>
				<div className="text-sm lg:text-base lg:w-2/3 w-full text-typo-secondary text-center">
					The development team of our
					<span className="text-typo-primary ml-1">Fintech</span> is driven by
					<span className="text-typo-primary ml-1">Passion,</span>
					<span className="text-typo-primary ml-1">Innovation,</span> and
					<span className="text-typo-primary ml-1">Enthusiasm</span>
				</div>
			</div>
			<div className="lg:flex grid grid-cols-2 lg:flex-row flex-col gap-x-1 gap-y-1 justify-start w-full h-full">
				{dataSource.map((item, i) => (
					<TeamElement key={i} item={item} />
				))}
			</div>
		</div>
	);
};

const DevTeamLanding = () => {
	return (
		<div className="bg-no-repeat bg-contain bg-left max-w-desktop mx-auto">
			<section className=" overflow-hidden w-full flex items-center justify-center gap-y-4 py-[3rem] sm:pt-[100px] sm:pb-[160px] lg:px-0">
				<AdvisorTab />
			</section>
		</div>
	);
};

export default DevTeamLanding;
