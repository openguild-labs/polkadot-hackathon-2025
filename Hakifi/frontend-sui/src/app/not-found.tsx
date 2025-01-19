import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center w-full h-max lg:mt-20 mt-12 gap-y-8">
			<Image
				src="/assets/images/not-found.png"
				className="lg:w-[538px] lg:h-[418px] w-full h-[302px]"
				alt="logo"
        width={538}
        height={418}
			/>
			<p className="lg:text-base text-sm text-typo-primary">Sorry, we couldn't find the page you're looking for</p>
			<Link href="/">
				<Button size="lg" variant="primary" className="w-[178px]">
					<p className="w-full text-center">Back to home page</p>
				</Button>
			</Link>
		</div>
	);
}
