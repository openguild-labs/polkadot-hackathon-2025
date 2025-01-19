import React from "react";

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="color"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fill="currentColor"
				d="M5.8.667h4.4v1.467H5.8zM4.333 2.133H5.8v4.4H4.333zM10.2 2.133h1.467v4.4H10.2zM5.8 6.533h4.4V8H5.8zM3.6 9.467h8.8v1.467H3.6zM2.133 10.933H3.6v2.933H2.133zM12.4 10.933h1.467v2.933H12.4zM2.133 13.867h11.733v1.467H2.133z"
			/>
		</svg>
	);
};

export default UserIcon;

export const DoubleUserIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				fill="currentColor"
				d="M2 21.091h12.727V22H2zM16.545 17.455H22v.909h-5.455zM2 17.455h1.818v3.636H2zM3.818 16.545h1.818v1.818H3.818zM5.636 14.727h1.818v1.818H5.636zM2.909 7.455h1.818v6.364H2.909zM4.727 5.636h5.455v1.818H4.727zM12 2h5.455v1.818H12z"
			/>
			<path
				fill="currentColor"
				d="M3.818 13.818h1.818v.909H3.818zM10.182 5.636H12v1.818h-1.818zM17.455 2h1.818v1.818h-1.818zM11.091 13.818h1.818v.909h-1.818zM18.364 10.182h1.818v.909h-1.818z"
			/>
			<path
				fill="currentColor"
				d="M12 7.455h1.818v6.364H12zM19.273 3.818h1.818v6.364h-1.818zM9.273 14.727h1.818v1.818H9.273zM16.545 11.091h1.818v1.818h-1.818zM11.091 16.545h1.818v1.818h-1.818zM18.364 12.909h1.818v1.818h-1.818zM12.909 17.455h1.818v3.636h-1.818z"
			/>
			<path fill="currentColor" d="M20.182 13.818H22v3.636h-1.818z" />
		</svg>
	);
};
