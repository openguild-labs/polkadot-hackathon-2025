import React, { useMemo, useState } from 'react';
import MobileRecord from './MobileRecord';
import Pagination from '@/components/common/Pagination';
import useInsuranceStore from '@/stores/insurance.store';
import { Insurance } from '@/@type/insurance.type';

const MobileVersion = () => {
    const [
        storeCurrentPage,
        setPagination,
        insurancesHistory,
        totalHistory,
        toggleDetailModal,
        setInsuranceSelected,
    ] = useInsuranceStore((state) => [
        state.currentPage,
        state.setPagination,
        state.insurancesHistory,
        state.totalHistory,
        state.toggleDetailModal,
        state.setInsuranceSelected,
    ]);
    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = useMemo(() => Math.ceil((totalHistory || 0) / 10), [totalHistory]);
    const onChangePagination = (page: number) => {
        setCurrentPage(page);

        setPagination(page + 1);
    };
    const previousPage = () => {
        setCurrentPage(pre => {
            const temp = pre - 1;
            setPagination(storeCurrentPage - 1);
            return temp;
        });
    };
    const nextPage = () => {
        setCurrentPage(pre => {
            const temp = pre + 1;
            setPagination(storeCurrentPage + 1);
            return temp;
        });
    };

    const getCanNextPage = useMemo(() => {
        return currentPage < pageCount - 1;
    }, [totalHistory, currentPage]);
    const getCanPreviousPage = useMemo(() => {
        return currentPage > 0;
    }, [totalHistory, currentPage]);

    return (
        <section className="mt-5 px-4 flex flex-col gap-4">
            {
                insurancesHistory.map(insurance => {
                    return (
                        <MobileRecord key={insurance.id} data={insurance} onShowDetail={handleOnClickInsurance} />
                    );
                })
            }

            {totalHistory > 1 ? (
                <Pagination
                    onPreviousPage={previousPage}
                    onNextPage={nextPage}
                    canNextPage={getCanNextPage}
                    canPreviousPage={getCanPreviousPage}
                    pageCount={pageCount}
                    pageIndex={currentPage}
                    setPageIndex={onChangePagination}
                    className="mt-4"
                />
            ) : null}
        </section>
    );
};

export default MobileVersion;