import { Wallet } from "@/@type/wallet.type";
import { getFriendInfo } from "@/apis/referral.api";
import Copy from "@/components/common/Copy";
import Modal from "@/components/common/Modal";
import useReferralStore from "@/stores/referral.store";
import useWalletStore from "@/stores/wallet.store";
import { substring } from "@/utils/helper";
import { useEffect, useState } from "react";
import { TFriendStatistic } from "../type";
import dayjs from "dayjs";
import { floorNumber } from "../constant";
import { formatNumber } from "@/utils/format";
import { useMemo } from "react";

type TProps = {
  open: boolean;
  handleClose: () => void;
};

const ModalInfoFriend = ({ open, handleClose }: TProps) => {
  const wallet: Wallet = useWalletStore((state) => state.wallet) as Wallet;
  const infoFriend = useReferralStore((state) => state.infoFriend);
  const [dataFriend, setDataFriend] = useState<Partial<TFriendStatistic>>({});
  useEffect(() => {
    const handleGetDataFriend = async (id: string) => {
      try {
        const res = await getFriendInfo(id);
        if (res) {
          setDataFriend(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (infoFriend?.id) {
      handleGetDataFriend(infoFriend?.id);
    }
  }, [infoFriend]);
  const { sharePercent, myPercent } = useMemo(() => {
    const sharePercent = (1 - (dataFriend?.metadata?.referralCode?.myPercent ?? 0)) as number;
    const myPercent = dataFriend?.metadata?.referralCode?.myPercent ?? 0;
    return { sharePercent, myPercent };
  }, [dataFriend]);

  return (
    <Modal onRequestClose={handleClose} isOpen={open} modal useDrawer={false}>
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-4 items-center text-2xl">
          <img
            src="/assets/images/icons/user_icon.png"
            className="w-20 h-20"
            alt="logo user"
          />
          {dataFriend?.username ? (
            <p className="text-typo-primary text-2xl">{wallet?.username}</p>
          ) : (
            "Anonymous"
          )}
          <Copy
            prefix={
              <p className="text-typo-accent">
                {substring(dataFriend?.walletAddress as string)}
              </p>
            }
            text={dataFriend?.walletAddress || ""}
            styleContent="text-base"
          />
        </div>
        <div className="p-4 w-full flex flex-col gap-y-3 items-center bg-support-black rounded-md text-sm">
          <div className="flex items-center justify-between w-full">
            <p className="text-typo-secondary">Margin</p>
            <p className="text-typo-primary">{formatNumber(dataFriend?.totalMargin , 2)} USDT</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-typo-secondary">Total contracts</p>
            <p className="text-typo-primary">{dataFriend?.totalContract}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 text-sm">
          <p className="text-typo-primary text-base">Reward</p>
          <div className="p-4 w-full flex flex-col gap-y-3 items-center bg-support-black rounded-md">
            <div className="flex items-center justify-between w-full">
              <p className="text-typo-secondary">Total reward</p>
              <p className="text-typo-primary">
                {floorNumber(dataFriend?.totalCommission || 0)} USDT
              </p>
            </div>
            {dataFriend?.metadata?.friendType === 1 ? (
              <div className="flex items-center justify-between w-full">
                <p className="text-typo-secondary">Shared reward</p>
                <p className="text-typo-primary">
                  {myPercent > 0
                    ? floorNumber((dataFriend?.totalCommission as number) / myPercent * (1 - myPercent))
                    : floorNumber(dataFriend?.totalCommission || 0)}{" "}
                  USDT
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-y-2 text-sm">
          <p className="text-typo-primary text-base">Details</p>
          <div className="p-4 w-full flex flex-col gap-y-3 items-center bg-support-black rounded-md">
            <div className="flex items-center justify-between w-full">
              <p className="text-typo-secondary">Referral code</p>
              <Copy
                text={dataFriend?.refCode || ""}
                prefix={dataFriend?.refCode}
                styleContent="text-typo-accent text-sm"
                styleCopy="!w-4 !h-4"
              />
            </div>
            {dataFriend?.metadata?.friendType === 1 ? (
              <>
                <div className="flex items-center justify-between w-full">
                  <p className="text-typo-secondary">You get / Friends get</p>
                  <p className="text-typo-primary">
                    {myPercent * 100} % / {sharePercent * 100} %
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-typo-secondary">Note</p>
                  <p className="text-typo-primary">
                    {dataFriend?.metadata?.note || "-----"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <p className="text-typo-secondary">Parent Address</p>
                <p className="text-typo-primary">
                  {substring(dataFriend?.metadata?.parent?.walletAddress || "")}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <p className="text-typo-secondary">Date of referral</p>
              <p className="text-typo-primary">
                {dayjs(dataFriend?.invitedAt).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInfoFriend;
