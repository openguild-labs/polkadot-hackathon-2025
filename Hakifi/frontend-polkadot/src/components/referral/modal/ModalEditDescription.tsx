import Modal from "@/components/common/Modal";
import useReferralStore from "@/stores/referral.store";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { substring } from "@/utils/helper";
import Button from "@/components/common/Button";
import Copy from "@/components/common/Copy";
import { useForm, Controller } from "react-hook-form";
import { updateDescriptionFriend } from "@/apis/referral.api";
import { useNotification } from "@/components/common/Notification";
interface ModalEditDescriptionProps {
	isOpen: boolean;
	onRequestClose: () => void;
	defaultNote: any;
}

const ModalEditDescription: React.FC<ModalEditDescriptionProps> = ({
	isOpen,
	onRequestClose,
	defaultNote,
}) => {
	const [friendInfo] = useReferralStore((state) => [state.infoFriend]);
	const form = useForm({ defaultValues: { note: friendInfo?.note || "" } });
	const {
		handleSubmit,
		watch,
		formState: { errors },
		control,
		setValue,
	} = form;
	const toast = useNotification();
	const handleUpdateDescription = async (data: { note: string }) => {
		const params = {
			childId: friendInfo.id,
			note: data?.note,
		};
		try {
			const res = await updateDescriptionFriend(params);
			if (res) {
				toast.success("Update description successfully");

				onRequestClose();
			}
		} catch (err) {
			toast.error("Update description failed");
		}
	};
	const watchField = watch();
	useEffect(() => {
		if (isOpen === false) {
			setValue("note", friendInfo?.note || "");
		}
	}, [isOpen, friendInfo]);
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			title={
				<div className="flex w-full flex-col items-start text-start">
					<p className="flex-1 text-center text-typo-primary">Edit note</p>
				</div>
			}
			modal={true}
			useDrawer={false}>
			<div className="flex flex-col gap-y-3">
				<div className="p-4 flex flex-col items-center gap-y-4 border bg-support-black border-divider-secondary rounded-md">
					<div className="w-full flex items-center justify-between">
						<p className="text-typo-secondary lg:text-sm text-xs">
							Wallet address
						</p>
						<p className="text-typo-primary lg:text-sm text-xs">
							<Copy
								text={friendInfo?.walletAddress}
								prefix={substring(friendInfo?.walletAddress)}
								styleContent="text-typo-primary lg:text-sm text-xs"
							/>
						</p>
					</div>
					<div className="w-full flex items-center justify-between">
						<p className="text-typo-secondary lg:text-sm text-xs">
							Referred time
						</p>
						<p className="text-typo-primary lg:text-sm text-xs">
							{dayjs(friendInfo?.createdAt).format("DD/MM/YYYY - hh:mm:ss")}
						</p>
					</div>
				</div>
				<form {...form}>
					<Controller
						control={control}
						rules={{
							required: true,
							maxLength: 50,
						}}
						render={({ field: { onChange, value } }) => (
							<div className="py-2 flex flex-col gap-y-1.5">
								<label
									htmlFor="note"
									className="text-typo-primary flex items-center justify-between">
									<p className="lg:text-base text-sm">Note</p>
									<p className="text-typo-secondary lg:text-sm text-xs">
										{value?.length || 0}/50
									</p>
								</label>
								<textarea
									className="h-[128px] w-full resize-none rounded-xxl bg-support-black border lg:text-sm text-xs border-divider-secondary focus:border-divider-primary rounded-md text-typo-secondary p-4 focus:outline-none"
									placeholder={friendInfo.note || "Enter your note"}
									onChange={(e) => onChange(e)}
									value={value}
									defaultValue={defaultNote}
								/>
								{errors?.note && (
									<span className="text-xs text-negative">
										{"Invalid description"}
									</span>
								)}
							</div>
						)}
						name="note"
					/>
				</form>
				<Button
					onClick={handleSubmit(handleUpdateDescription)}
					size="lg"
					variant="primary"
					className="w-full mt-5"
					disabled={
						watchField?.note === defaultNote && watchField?.note?.length === 0
					}
					type="submit">
					<p className="text-center w-full">Confirm</p>
				</Button>
			</div>
		</Modal>
	);
};

export default ModalEditDescription;
