"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
type Props = {
	children?: React.ReactNode;
};

const BuyCoverLayout = ({ children }: Props) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		mounted === true && (
			<main className="flex min-h-screen flex-col">
				<Header />
				<div className="max-w-full flex-1 bg-light-2 lg:mt-0">{children}</div>
			</main>
		)
	);
};

export default BuyCoverLayout;
