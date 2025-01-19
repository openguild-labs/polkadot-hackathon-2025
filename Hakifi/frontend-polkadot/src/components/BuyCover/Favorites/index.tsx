"use client";

import { Pair } from '@/@type/pair.type';
import { getPairsApi } from '@/apis/pair.api';
import FireIcon from '@/components/common/Icons/FireIcon';
import SwiperHorizontal from '@/components/common/Swiper';
import { handleRequest } from '@/utils/helper';
import { Suspense, memo, useCallback, useEffect, useState } from 'react';
import FavoriteItem from './FavoritesItem';
import FavoritesLoader from '../Loader/FavoritesLoader';

function Favorites() {
    const [pairs, setPairs] = useState<Pair[]>([]);
    const getPairs = useCallback((async () => {
        const [err, response] = await handleRequest(getPairsApi({ page: 1, includePrice: true }));

        if (err) return;
        const { rows } = response;
        setPairs(rows);
    }), []);

    useEffect(() => {
        getPairs();
    }, []);

    const renderPairs = useCallback(() => {
        if (pairs.length > 0) {
            return <section className="flex items-center">
                {
                    pairs.map((pair: Pair, index: number) => {
                        return <FavoriteItem key={pair.id} pair={pair} isFirst={index === 0} />;
                    })
                }
            </section>;
        }
        return <FavoritesLoader />;
    }, [pairs]);

    return (
        <section className="items-center flex px-4 sm:px-5">
            <div className="mr-4">
                <FireIcon />
            </div>
            <SwiperHorizontal arrow={true}>
                {renderPairs()}
            </SwiperHorizontal>
        </section>
    );
}

export default memo(Favorites);