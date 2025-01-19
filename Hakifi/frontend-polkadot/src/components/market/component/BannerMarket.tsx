export default function BannerMarket() {
	return (
		<section className="mt-4 lg:mt-0 flex flex-col lg:flex-row items-center justify-between bg-[url(/assets/images/market/banner.png)] lg:bg-right-top bg-[center_bottom_1rem] bg-no-repeat lg:bg-[length:55%_100%] bg-[length:100%_50%] lg:py-[160px] pt-4 pb-[324px]">
			<div className="lg:px-5 lg:w-[50%]">
				<h1 className="text-typo-accent text-[28px] lg:text-5xl text-center lg:text-start font-determination font-normal leading-[42px] lg:leading-[48px]">
					WELCOME TO <br /> HAKIFI MARKET
				</h1>
				<p className=" text-typo-primary text-sm lg:text-xl text-center lg:text-start leading-6 font-medium font-saira mt-1 lg:mt-4">
					A Comprehensive overview of the current market <br /> that keeps you
					up-to-date and empower you to make <br /> informed trading decisions
				</p>
			</div>
		</section>
	);
}
