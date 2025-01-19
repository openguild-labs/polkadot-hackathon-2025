import Image from 'next/image';
import React from 'react';

const Empty = () => {
    return (
        <section className="flex flex-col items-center justify-center gap-2 p-3">
            <Image
                width={124}
                height={124}
                quality={100}
                src="/assets/images/icons/noData_icon.png"
                alt="No data"
                className="lg:w-[124px] lg:h-[124px] w-[80px] h-[80px]"
            />
            <section className="text-center text-typo-secondary text-body-16">
                There are no post matching your search.
            </section>
        </section>
    );
};

export default Empty;