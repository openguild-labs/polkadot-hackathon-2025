import { cn } from '@/utils';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Images } from '@/components/common/images';
import { CryptoData } from '@/models';
const DynamicAreaGraph = dynamic(() => import('./chart').then((mod) => mod.AreaGraph));

const CryptoCard = ({ item }: { item: CryptoData }) => (
    <Card className="rounded-2xl">
        <CardContent className="grid grid-cols-3 gap-4 py-3">
            <div className="flex items-center space-x-3">
                <Images.crypto className="rounded-full" name={item.symbol.slice(0, -4)} size={32} />
                <div>
                    <p className="font-semibold">{item.symbol.slice(0, -4)}</p>
                </div>
            </div>

            <div className="col-span-1">
                <DynamicAreaGraph data={item.list_prices} />
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
            </div>
        </CardContent>
    </Card>
);
export default CryptoCard;
