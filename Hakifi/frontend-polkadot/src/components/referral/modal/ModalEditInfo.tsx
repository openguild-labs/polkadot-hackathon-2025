import { useForm, Controller } from "react-hook-form";
import { updateUser } from "@/apis/users.api";
import { Wallet } from "@/@type/wallet.type";
import Modal from "@/components/common/Modal";
import clsx from "clsx";
import useWalletStore from "@/stores/wallet.store";
import { useNotification } from "@/components/common/Notification";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { set } from "date-fns";
import debounce from "lodash.debounce";
import { ChangeEvent, ChangeEventHandler, FormEvent } from "react";
import useReferralStore from "@/stores/referral.store";
type TProps = {
	userInfo: Wallet;
	open: boolean;
	handleClose: () => void;
};

export function ModalInfo({ userInfo, open, handleClose }: TProps) {
	const [openModalInfo, setOpenModalInfo] = useReferralStore((state) => [
		state.openModalInfo,
		state.setOpenModalInfo,
	]);
	const handleCloseModal = () => {
		setOpenModalInfo(false);
	};
	const form = useForm({ defaultValues: userInfo });
	const {
		handleSubmit,
		watch,
		formState: { errors },
		setError,
		control,
		setValue,
	} = form;
	const [wallet, setWallet] = useWalletStore((state) => [
		state.wallet,
		state.setWallet,
	]);
	const toast = useNotification();
	const onSubmit = async (data: Wallet,) => {
		const params = {
			username: data?.username,
			email: data?.email,
			refCode: data?.refCode || undefined,
		};
		try {
			const res: any = await updateUser(params);
			if (res) {
				setWallet(res.data);
				toast.success("Update user information successfully!");
				// handleClose();

			}
		} catch (err) {
			toast.error("Update user information failed");
		}
	};
	const watchFields = watch();

	const handleErrors = (fieldName: string) => {
		return errors[fieldName as keyof Wallet];
	};
	const pasteFromClipboard = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault(); // Prevent form submission
		try {
			const text = await navigator.clipboard.readText();
			if (text.length > 8) {
				setError("refCode", { message: "Referral biggest length" });
			}
			return setValue("refCode", text.toUpperCase());
		} catch (error) {
			console.error("Failed to read text from clipboard:", error);
			return "";
		}
	};

	const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// do your early validation here

		handleSubmit(onSubmit)(e);

		handleCloseModal();

	};
	const handleChange = (
		e: ChangeEvent<HTMLInputElement>,
		callBack: ChangeEventHandler<HTMLInputElement>
	) => {
		const regex = /^[a-zA-Z0-9_.]+$/;
		const value = e.target.value;
		callBack(e);
		if (value.length < 4) {
			return setError("username", {
				message: "Username must be longer than 4 characters.",
			});
		} else if (value.length > 15) {
			return setError("username", {
				message: "Username must be shorter than 15 characters.",
			});
		} else if (!regex.test(value)) {
			setError("username", {
				message: "Username can only contain letters, numbers and '_'.",
			});
		} else {
			setError("username", {
				message: "",
			});

			callBack(e);
		}
	};

	return (
		<Modal
			title={<div className="text-typo-primary">Personal information</div>}
			isOpen={openModalInfo}
			onRequestClose={handleCloseModal}
			modal={true}
			useDrawer={false}
		// descriptionClassName="!py-0"
		// titleClassName="!px-0"
		>
			<div className="grid gap-4">
				<form {...form} onSubmit={(e) => handleSubmitForm(e)}>
					<div className="flex flex-col gap-y-3">
						<Controller
							control={control}
							rules={{
								required: true,
								pattern: {
									value: /^[a-zA-Z0-9_.]+$/,
									message: "Invalid username",
								},
							}}
							render={({ field: { onChange } }) => (
								<div className="py-2 flex flex-col gap-y-1.5">
									<label
										htmlFor="username"
										className="text-sm text-typo-primary"
									>
										Username
									</label>
									<Input
										type="text"
										value={watchFields?.username || ""}
										onChange={(e) => handleChange(e, onChange)}
										wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
										size="lg"
										placeholder="Enter username"
									/>
									{handleErrors("username") && (
										<span className="text-xs text-negative">
											{errors.username?.message}
										</span>
									)}
								</div>
							)}
							name="username"
						/>
						<Controller
							control={control}
							rules={{
								required: true,
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Invalid email address",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<div className="py-2  flex flex-col gap-y-1.5">
									<label htmlFor="email" className="text-sm text-typo-primary">
										Email
									</label>
									<Input
										type="email"
										onChange={(e) => {
											const regex =
												/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
											const value = e.target.value;
											onChange(e);
											if (regex.test(value)) {
												setError("email", {
													message: "",
												});
											} else {
												setError("email", {
													message: "Please enter a invalid email",
												});
											}
										}}
										value={value}
										wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
										size="lg"
										placeholder="Enter email address"
									/>
									{handleErrors("email") && (
										<span className="text-xs text-negative">
											{errors.email?.message}
										</span>
									)}
								</div>
							)}
							name="email"
						/>
					</div>
					<div
						className={clsx(
							"flex w-full justify-center rounded-xxl bg-primary-1 text-typo-tertiary mt-5",
							{
								"!bg-light-1": Object.keys(errors).length > 0,
							}
						)}
					>
						<Button
							type="submit"
							className="w-full"
							// onClick={()}
							variant="primary"
							size="lg"
						>
							<p className="text-center w-full">Confirm</p>
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
