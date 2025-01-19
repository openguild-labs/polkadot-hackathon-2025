import { PairDetail } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useNotification } from "@/components/common/Notification";
import TooltipCustom from "@/components/common/Tooltip";
import useTicker from "@/hooks/useTicker";
import { informula } from "@/lib/informula";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { HEDGE_INIT } from "@/utils/constant";
import { formatNumber, formatTime } from "@/utils/format";
import { handleRequest, inRange } from "@/utils/helper";
import { PERIOD_UNIT } from "hakifi-formula";
import { useParams } from "next/navigation";
import { ChangeEvent, useMemo } from "react";
import { STEP } from ".";
import useBuyCover from "../hooks/useBuyCover";
import usePClaimRange from "../hooks/usePClaimRange";
import Countdown from 'react-countdown';
import useCountDown from "@/hooks/useCountDown";
import Link from "next/link";

type StepConfirmProps = {
  setStep: (step: STEP) => void;
  onCloseModal: () => void;
  pair: PairDetail;
};

const StepConfirm = ({ pair, setStep, onCloseModal }: StepConfirmProps) => {
  const notifications = useNotification();
  const { symbol } = useParams();
  const { buyCover } = useBuyCover(pair);
  const ticker = useTicker(symbol as string);
  const p_market = ticker?.lastPrice || 0;
  const [
    q_claim,
    q_covered,
    margin,
    period,
    periodUnit,
    hedge,
    periodChangeRatio,
    p_claim,
    t_expired,
    refCode,
    updateParams,
  ] = useBuyCoverStore((state) => [
    state.q_claim,
    state.q_covered,
    state.margin,
    state.period,
    state.periodUnit,
    state.hedge,
    state.periodChangeRatio,
    state.p_claim,
    state.expiredAt,
    state.refCode,
    state.updateParams,
  ]);

  const handleOnChangeRefCode = (event: ChangeEvent<HTMLInputElement>) => {
    updateParams({
      refCode: event.target.value,
    });
  };

  const handleConfirmAction = async () => {
    setStep(STEP.SIGN);
    const [err, response] = await handleRequest(
      buyCover({
        q_covered: Number(q_covered),
        p_claim: Number(p_claim),
        margin: Number(margin),
        period: Number(period),
        // TODO: Add HOUR LOGIC
        periodUnit,
      }),
    );
    if (err) {
      notifications.error(err.message);
      onCloseModal();
      return;
    }
    setStep(STEP.WAITING);
  };

  const pClaimRange = usePClaimRange(pair);
  const minPClaim = pClaimRange?.min || 0;
  const maxPClaim = pClaimRange?.max || 0;

  const general = useMemo(() => {
    let getQClaim = 0;
    try {
      getQClaim = informula.calculateQClaim({
        hedge: (hedge as number) || HEDGE_INIT,
        day_change_token: periodChangeRatio as number,
        margin: margin as number,
        p_claim: p_claim as number,
        p_open: p_market,
        period_unit: periodUnit as PERIOD_UNIT,
      });
    } catch (error) {
      // throw error
    }
    const _q_claim = getQClaim || 0;
    const _r_claim = (_q_claim / margin) * 100 || 0;

    return {
      q_claim: _q_claim || q_claim || 0,
      r_claim: _r_claim,
    };
  }, [p_claim, p_market]);

  const handleRefCode = () => {
    if (refCode === "tuanh") return true;
    return false;
  };

  const count = useCountDown(10);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-title-20 text-left sm:text-title-24 text-typo-primary">
        Margin confirmation
      </p>
      <section className="border-divider-secondary flex flex-col gap-4 border p-4 rounded bg-support-black">
        <div className="flex items-center justify-between text-body-14">
          <p className="text-typo-secondary">Period</p>
          <p className="text-typo-primary text-body-14">
            {period} {periodUnit}
          </p>
        </div>
        <div className="flex items-center justify-between text-body-14">
          <p className="text-typo-secondary">Expires at</p>
          <p className="text-typo-primary">
            {formatTime(t_expired as Date)}
          </p>
        </div>
        <div className="flex items-center justify-between text-body-14">
          <p className="text-typo-secondary">Margin</p>
          <p className="text-typo-primary">
            {formatNumber(margin)} USDT
          </p>
        </div>
        <div className="flex items-center justify-between text-body-14">
          <p className="text-typo-secondary">Claim amount</p>
          <p className="text-typo-primary">
            {formatNumber(general.q_claim)} USDT (
            <span className="text-positive">
              {formatNumber(general.r_claim)}%
            </span>
            )
          </p>
        </div>
        <div className="flex items-center justify-between text-body-14">
          <p className="text-typo-secondary">Referal code</p>
          <TooltipCustom
            content={"Incorrect referral code format"}
            isOpen={handleRefCode()}
            titleClassName="text-typo-primary"
            title={
              <Input
                size="lg"
                value={refCode}
                wrapperClassInput="max-w-[250px]"
                className="text-right"
                placeholder="Enter referral code"
                onChange={handleOnChangeRefCode}
              />
            }
            showArrow={true}
          />
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <p className="text-body-14 text-typo-secondary">
          (*) Margin refund condition: At expiration time, Market price is between Refund price and Claim price.
        </p>
        <p className="text-body-14 text-typo-secondary">
          (**) Contract liquidation condition: Market price reaches Liquid. price.
        </p>
      </section>
      <Button
        variant="primary"
        size="lg"
        type="button"
        onClick={handleConfirmAction}
        className="w-full justify-center gap-1"
      >
        Confirm {count > 0 && (<p>({count}s)</p>)}
      </Button>
      <p className="text-body-14 text-typo-secondary text-center">
        By choosing "Confirm", you agree to the
        <Link href="https://docs.hakifi.io/documents/terms-of-use" target="_blank" className="text-typo-accent hover:border-b hover:border-typo-accent">{" "}Hakifi's Terms of service</Link>
      </p>
    </div>
  );
};

export default StepConfirm;
