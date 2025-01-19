import Image from 'next/image';
import { LucideProps } from 'lucide-react';
// import OnboardingFigure from '@/public/img/onboarding/figure.svg';
import DexonicLogo from '@/public/img/dexonic-logo.svg';
import BinanceLogo from '@/public/img/Binance.png';
import BybitLogo from '@/public/img/Bybit.svg';
import { cn } from '@/utils';

export type Icon = React.FC<LucideProps>;

type CryptoProps = LucideProps & {
    name: string;
};

export const Images = {
    // onboardingFigure: ({ ...props }: LucideProps) => (
    //     <Image src={OnboardingFigure} className={props.className} alt="" />
    // ),
    dexonicLogo: ({ ...props }: LucideProps) => (
        <Image src={DexonicLogo} className={props.className} alt="Dexonic Logo" />
    ),
    binance: ({ ...props }: LucideProps) => (
        <Image src={BinanceLogo} className={cn(props.className)} alt="Binance logo" />
    ),
    bybit: ({ ...props }: LucideProps) => (
        <Image src={BybitLogo} className={cn(props.className)} alt="Bybit logo" />
    ),
    crypto: ({ name, size = '32', ...props }: CryptoProps) => (
        <Image
            src={`https://bin.bnbstatic.com/static/assets/logos/${name.toLocaleUpperCase()}.png`}
            width={typeof size === 'number' ? size : parseInt(size)}
            height={typeof size === 'number' ? size : parseInt(size)}
            className={props.className}
            alt="name"
        />
    ),
};
