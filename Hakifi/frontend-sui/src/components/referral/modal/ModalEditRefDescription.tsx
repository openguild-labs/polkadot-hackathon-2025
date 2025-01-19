import Modal from "@/components/common/Modal";
import React, { useEffect } from "react";
import Button from "@/components/common/Button";
import { useForm, Controller } from "react-hook-form";
import { useNotification } from "@/components/common/Notification";
import { updateDescRefCode } from "@/apis/referral.api";
interface ModalEditRefDescriptionProps {
	isOpen: boolean;
	onRequestClose: () => void;
	infoCode: any;
}

const ModalEditRefDescription: React.FC<ModalEditRefDescriptionProps> = ({
	isOpen,
	onRequestClose,
	infoCode,
}) => {
	const form = useForm({ defaultValues: { note: infoCode?.description || "" } });
	const {
		handleSubmit,
		watch,
		formState: { errors },
		control,
		setValue,
	} = form;
	const watchField = watch();
	const toast = useNotification();
	const handleUpdateDescriptionRefCode = async (data: { note: string }) => {
		try {
			const res = await updateDescRefCode({
				description: data.note,
				code: infoCode.code,
			});
			if (res) {
				toast.success("Edit description referral code successfully!");
				onRequestClose();
			}
		} catch (err) {
			toast.error("Edit description referral code error!");
		}
	};
	useEffect(() => {
		if (isOpen === false) {
			setValue("note", infoCode?.note || "");
		}
	}, [isOpen, infoCode]);
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
									<p className="text-typo-secondary text-sm">
										{value?.length || 0}/50
									</p>
								</label>
								<textarea
									className="h-[128px] w-full resize-none rounded-xxl bg-support-black border border-divider-secondary focus:border-divider-primary rounded-md text-typo-secondary p-4 focus:outline-none"
									placeholder={infoCode?.description || "Enter your note"}
									onChange={(e) => onChange(e)}
									value={value}
									defaultValue={infoCode?.description}
								/>
								{errors.note && (
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
					onClick={handleSubmit(handleUpdateDescriptionRefCode)}
					size="lg"
					variant="primary"
					className="w-full mt-5"
					disabled={
						watchField.note === infoCode?.note && watchField.note?.length === 0
					}
					type="submit">
					<p className="text-center w-full">Confirm</p>
				</Button>
			</div>
		</Modal>
	);
};

export default ModalEditRefDescription;
