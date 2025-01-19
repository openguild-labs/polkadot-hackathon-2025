import { cn } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Images } from '@/components/common/images';
import { CryptoData } from '@/models';

export const PairCard = ({ item }: { item: CryptoData }) => (
    <Card className="rounded-2xl">
        <CardContent className="grid grid-cols-2 gap-4 py-3">
            <div className="flex items-center space-x-3">
                <Images.crypto className="rounded-full" name={item.symbol.slice(0, -4)} size={32} />
                <div>
                    <p className="font-semibold">{item.symbol.slice(0, -4)}</p>
                </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
                <p className="font-semibold">${item.price.toFixed(2)}</p>
                <p
                    className={cn(
                        'text-sm',
                        item.price_change > 0 ? 'text-green-600' : 'text-red-600',
                    )}
                >
                    {item.price_change.toFixed(2)}%
                </p>
                {item.list_prices && item.list_prices.length > 0 && (
                    <div className="text-xs text-gray-400">
                        Prices: {item.list_prices.join(', ')}
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);
