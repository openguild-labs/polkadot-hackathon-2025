import { Images } from '@/components/common/images';
import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/utils';
import Link from 'next/link';
import { isNil } from 'lodash';
import SymbolDetail from './symbol-detail';

export type SheetState = {
    isOpen: boolean;
    symbol?: string;
    price?: string;
    prediction?: string;
    correct?: string;
    total?: string;
};

interface Props {
    setSheet: (sheet: SheetState) => void;
    sheet: SheetState;
}

export default function SheetComponent({ sheet, setSheet }: Props) {
    if (isNil(sheet)) return null;

    return (
        <Sheet open={sheet.isOpen} onOpenChange={(isOpen) => setSheet({ ...sheet, isOpen })}>
            <SheetContent side="bottom" className="mx-auto h-[90vh] max-w-md overflow-y-auto">
                <div className="h-[80vh] p-6">
                    <div className="mb-5 text-center">
                        Symbol
                        <p className="font-bold">{sheet.symbol}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-blue-200 p-4">
                            <p className="mb-1 text-sm text-blue-800">Current Price</p>
                            <p className="text-xl font-semibold text-blue-800">
                                ${Number(sheet.price).toPrecision(6)}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'rounded-lg p-4',
                                Number(sheet.prediction) > Number(sheet.price)
                                    ? 'bg-green-200'
                                    : 'bg-red-200',
                            )}
                        >
                            <p
                                className={cn(
                                    'mb-1 text-sm',
                                    Number(sheet.prediction) > Number(sheet.price)
                                        ? 'text-green-800'
                                        : 'text-red-800',
                                )}
                            >
                                1H Prediction
                            </p>
                            <p
                                className={cn(
                                    'text-xl font-semibold',
                                    Number(sheet.prediction) > Number(sheet.price)
                                        ? 'text-green-800'
                                        : 'text-red-800',
                                )}
                            >
                                ${Number(sheet.prediction).toPrecision(6)}
                            </p>
                        </div>
                    </div>
                    {sheet.symbol && <SymbolDetail symbol={sheet.symbol} />}
                    {/* <div className="mt-5 w-full text-center font-bold">Start Trade On</div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <Link
                            href={`https://www.binance.com/en/trade/${sheet.symbol}?type=spot`}
                            target="_blank"
                            className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'w-full bg-[#181320] hover:bg-slate-800',
                            )}
                        >
                            <Images.binance width={10} />
                        </Link>
                        <Link
                            href={`https://www.bybit.com/vi-VN/trade/spot/${sheet.symbol?.slice(0, -4)}/USDT`}
                            target="_blank"
                            className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'w-full bg-[#17181e] hover:bg-slate-800',
                            )}
                        >
                            <Images.bybit />
                        </Link>
                    </div> */}
                </div>
            </SheetContent>
        </Sheet>
    );
}
