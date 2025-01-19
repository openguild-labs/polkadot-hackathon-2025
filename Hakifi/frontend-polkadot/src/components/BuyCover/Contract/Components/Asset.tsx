import { Pair } from '@/@type/pair.type';
import Image from 'next/image';

interface ITokenItemProps {
    pair: Pair;
}

const AssetItem = ({ pair }: ITokenItemProps) => {
    return (
        <section key={pair.id} className="mt-3 flex items-center justify-between">
            <section className="flex-[1.5] flex items-center gap-2 text-body-14 text-grey-1">
                <Image
                    src={pair.token.attachment}
                    width={24}
                    height={24}
                    alt="logo"
                />
                <span className="text-typo-primary">{pair.asset}</span>
                <span className="text-grey-1">/{pair.unit}</span>
            </section>
        </section>
    );
};

export default AssetItem;