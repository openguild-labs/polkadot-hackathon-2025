import Image from "next/image";

const EmptyData = () => {
	return (
		<section className="flex flex-col items-center justify-center min-h-[300px] gap-2">
			<Image
				width={124}
				height={124}
				quality={100}
				src="/assets/images/icons/noData_icon.png"
				alt="No data"
				className="lg:w-[124px] lg:h-[124px] h-20 w-20"
			/>
			<section className="text-center text-typo-secondary text-sm lg:text-base">
				<p>There is no data to display</p>
			</section>
		</section>
	);
};

export default EmptyData;
