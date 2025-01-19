
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class CustomDocument extends Document {
	
	render() {
		return (
			<Html>
				<Head></Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}