import React, { useMemo, useRef } from "react";
import QRCode from "qrcode.react";
import DomToImage from "dom-to-image";
import { useIsMobile } from "@/hooks/useMediaQuery";
import clsx from "clsx";
import { Wallet } from "@/@type/wallet.type";
import Modal from "@/components/common/Modal";
import { useNotification } from "@/components/common/Notification";
import Button from "@/components/common/Button";
interface ModalQRProps {
	userInfoCode: Wallet;
	openModalQR: boolean;
	handleCloseModalQR: () => void;
}
const FILE_NAME = "My-QRCode.png";
const ModalQR: React.FC<ModalQRProps> = ({
	userInfoCode,
	openModalQR,
	handleCloseModalQR,
}) => {
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const isMobile = useIsMobile();
	const nofication = useNotification();
	const qrValue = useMemo(
		() => userInfoCode?.defaultMyRefCode,
		[userInfoCode?.defaultMyRefCode]
	);
	const options = (el: any) => {
		const scale = 2;
		const option = {
			height: el.offsetHeight * scale,
			width: el.offsetWidth * scale,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				width: `${el.offsetWidth}px`,
				height: `${el.offsetHeight}px`,
			},
		};
		return option;
	};

	const onShare = async () => {
		try {
			const file = await formatFile();
			if (file) {
				timer.current = setTimeout(() => {
					share(file);
				}, 100);
			}
		} catch (error) {
			console.error(error);
		}
	};
	const share = async (file: File) => {
		if (!isMobile) {
			return saveFile(file, FILE_NAME);
		}
		if (!("share" in navigator)) {
			return nofication.error("Sorry, we can't support your browser!");
		}

		if (navigator.canShare({ files: [file] })) {
			try {
				await navigator.share({
					title: "Images",
					text: "text",
					files: [file],
				});
				saveFile(file, FILE_NAME);
				nofication.success("Download QRCode image success!");
			} catch (e) {
				const message = e instanceof Error ? e.message : "Unknown error.";
				console.error("Error", message);
			}
		} else {
			nofication.error("Sorry, we can't support your device");
		}
	};

	const saveFile = (file: File, name: string) => {
		const a = document.createElement("a");
		const url = URL.createObjectURL(file);
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

	const formatFile = () => {
		const el = document.getElementById("capture-qrCode") as HTMLElement;
		if (el) {
			const option = options(el);
			return DomToImage.toBlob(el, option)
				.then((blob: Blob) => {
					return new File([blob], FILE_NAME, { type: "image/png" });
				})
				.catch((error) => console.error(error));
		}
	};

	const renderDesktop = () => {
		return (
			<div
				className="border border-divider-secondary rounded-md lg:mt-0 mt-5"
				id="capture-qrCode">
				<div
					style={{
						backgroundImage: isMobile
							? "url(/assets/images/referral/bg_mobile_qrCode.png)"
							: "url(/assets/images/referral/bg_desktop_qrCode.png)",
					}}
					className="w-full lg:h-[198px] h-[218px]  overflow-hidden bg-cover bg-right bg-no-repeat shadow-md">
					<div className="flex flex-col gap-y-10 p-4">
						<div className="flex flex-col items-start gap-y-3">
							<p className="text-3xl font-bold text-typo-accent font-determination uppercase">
								Join Hakifi
							</p>
							<p className="text-sm text-typo-primary">
								Register now <br />
								Make money together
							</p>
						</div>
					</div>
				</div>
				<div className=" flex items-center justify-between bg-background-tertiary px-4 py-3">
					<div className=" flex items-center justify-start gap-x-1 text-3xl font-determination font-bold text-typo-accent">
						<img
							src="/assets/images/icons/icon_logo.png"
							alt="logo"
							className="w-[52px] h-[52px]"
						/>
					</div>
					<div className="flex gap-x-2 items-center">
						<div className="text-base flex flex-col gap-y-2 items-end">
							<p className="text-xs text-support-white">Referral ID</p>
							<p className="text-typo-accent px-3 py-1 border border-divider-primary bg-background-secondary rounded-md">
								{qrValue}
							</p>
						</div>
						<div className="w-max rounded-md bg-support-white p-2">
							<QRCode
								className="rounded-sm"
								value={`${process.env.NEXT_PUBLIC_APP_URL}/commission?ref=${qrValue}`}
								size={50}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Modal
			isOpen={openModalQR}
			onRequestClose={handleCloseModalQR}
			contentClassName="px-4"
			className="!text-typo-primary"
			descriptionClassName="!px-0"
			modal
			useDrawer={false}>
			<>
				{renderDesktop()}
				<Button
					size="lg"
					onClick={() => onShare()}
					variant="primary"
					className="w-full !mt-5 text-center">
					<p className="text-center w-full">Download</p>
				</Button>
			</>
		</Modal>
	);
};

export default ModalQR;
