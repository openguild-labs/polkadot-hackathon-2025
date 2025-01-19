import { addReferralCode } from "@/apis/referral.api";
import CommonInput from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNotification } from "@/components/common/Notification";
import useWalletStore from "@/stores/wallet.store";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
interface ModalAddReferralCodeProps {
	open: boolean;
	onClose: () => void;
}

const ModalAddReferralCode: React.FC<ModalAddReferralCodeProps> = (props) => {
	const form = useForm({
		defaultValues: {
			code: "",
		},
	});
	const [checked, setChecked] = React.useState(false);
	const {
		watch,
		formState: { errors },
		handleSubmit,
		setValue,
		control,
		setError,
	} = form;

	const toast = useNotification();
	const setWallet = useWalletStore((state) => state.setWallet);
	const pasteFromClipboard = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault(); // Prevent form submission
		try {
			const text = await navigator.clipboard.readText();
			if (text.length > 8) {
				setError("code", { message: "Referral biggest length" });
			}
			return setValue("code", text.toUpperCase());
		} catch (error) {
			console.error("Failed to read text from clipboard:", error);
			return "";
		}
	};
	useEffect(() => {
		const refCode = localStorage.getItem("refCode");
		if (refCode) {
			setValue("code", refCode);
		}
	}, [setValue]);
	const handleAddReferralCode = async (data: any) => {
		try {
			const res = await addReferralCode({ code: data.code });

			if (res) {
				setWallet(res.data);
				toast.success("Add referral code successfully!");
			}
			props.onClose();
		} catch (err: any) {
			setError("code", {
				message:
					err.response.data.message === "INVALID_REFERRAL_CODE"
						? "You can’t add your own referral code"
						: "This referral code doesn’t exist",
			});
			return err;
		}
	};
	const watchedFields = watch();

	return (
		<Modal
			isOpen={props.open}
			onRequestClose={props.onClose}
			modal={true}
			useDrawer={false}
			contentClassName="px-4"
			descriptionClassName="!px-0"
			titleClassName="!px-0"
		>
			<form {...form} className="flex flex-col gap-y-5">
				<div>
					<p className="text-typo-primary lg:text-2xl text-lg mb-4 leading-6">Referral code</p>
					<Controller
						render={({ field: { onChange, value } }) => (
							<CommonInput
								wrapperClassInput="w-full resize-none rounded-md bg-support-black border border-divider-secondary"
								suffix={
									<button
										onClick={(e) => pasteFromClipboard(e)}
										className="text-typo-primary hover:text-typo-accent text-sm"
									>
										Paste
									</button>
								}
								value={value.toUpperCase()}
								onChange={(e) => {
									let value = e.target.value;
									value = value
										.normalize("NFD")
										.replace(/[\u0300-\u036f]/g, "");
									if (value.length > 8) {
										value = value.slice(0, 8);
									} else if (value.length < 6) {
										setError("code", {
											message:
												"Referral code must be at least 6 characters long.",
										});
									} else {
										setError("code", { message: undefined });
									}
									onChange(value.toUpperCase());
								}}
								size="lg"
								placeholder="Enter referral code"
							/>
						)}
						rules={{
							required: true,
							maxLength: 8,
							pattern: /^[a-zA-Z0-9]*$/,
						}}
						name="code"
						control={control}
					/>
					{errors.code?.message && (
						<div className="text-xs text-negative">{errors.code.message}</div>
					)}
				</div>
				<Checkbox
					checked={checked}
					onChange={(e) => setChecked(e.target.checked)}
					label="Referral code is non-editable, ensure taking from the right referrer."
					labelClassName="!text-sm"
					size="md"
				/>
				<Button
					size="lg"
					variant="primary"
					onClick={handleSubmit(handleAddReferralCode)}
					disabled={watchedFields.code.length === 0 || checked === false}
				>
					<p className="text-center w-full">Confirm</p>
				</Button>
			</form>
		</Modal>
	);
};

export default ModalAddReferralCode;
