'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Autoplay from 'embla-carousel-autoplay';

export default function CarouselCoin() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    const items = [
        { id: 1, src: 'https://i.imgur.com/5EJz6wC.png', link: '/' },
        { id: 2, src: 'https://i.imgur.com/ng5Gk6g.png', link: '/analysis' },
        { id: 3, src: 'https://i.imgur.com/Kpdi9T8.png', link: 'https://x.com/Dexonic11' },
    ];

    React.useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleDotClick = (index: number) => {
        api?.scrollTo(index);
    };

    return (
        <div className="mx-auto w-full max-w-[300px] px-4">
            <Carousel
                setApi={setApi}
                className="w-full"
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                {/* <CarouselPrevious>
                    <ChevronLeft className="h-4 w-4" />
                </CarouselPrevious> */}
                <CarouselContent>
                    {items.map((item) => (
                        <CarouselItem key={item.id}>
                            <Link
                                href={item.link}
                                target={item.link.startsWith('http') ? '_blank' : '_self'}
                            >
                                <Card className="cursor-pointer rounded-3xl border-none">
                                    <AspectRatio ratio={2 / 1} className="rounded-lg bg-muted">
                                        <Image
                                            src={item.src}
                                            alt="Carousel Image"
                                            fill
                                            className="h-full w-full rounded-md object-cover"
                                        />
                                    </AspectRatio>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* <CarouselNext>
                    <ChevronRight className="h-4 w-4" />
                </CarouselNext> */}
            </Carousel>
            <div className="mt-4 flex justify-center gap-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            'h-3 w-3 rounded-full transition-colors duration-200',
                            current === index ? 'bg-primary' : 'bg-white',
                        )}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}
