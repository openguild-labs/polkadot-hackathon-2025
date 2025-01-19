import React, { useMemo, useState } from 'react';
import MobileRecord from './MobileRecord';
import Pagination from '@/components/common/Pagination';
import useInsuranceStore from '@/stores/insurance.store';
import { Insurance } from '@/@type/insurance.type';

const MobileVersion = () => {
    const [
        storeCurrentPage,
        setPagination,
        insurancesOpening,
        totalOpening,
        toggleDetailModal,
        setInsuranceSelected,
        toggleCloseModal,
    ] = useInsuranceStore((state) => [
        state.currentPage,
        state.setPagination,
        state.insurancesOpening,
        state.totalOpening,
        state.toggleDetailModal,
        state.setInsuranceSelected,
        state.toggleCloseModal,
    ]);
    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = useMemo(() => Math.ceil((totalOpening || 0) / 10), [totalOpening]);
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
    }, [totalOpening, currentPage]);
    const getCanPreviousPage = useMemo(() => {
        return currentPage > 0;
    }, [totalOpening, currentPage]);

    return (
        <section className="mt-5 px-4 flex flex-col gap-4">
            {
                insurancesOpening.map(insurance => {
                    return (
                        <MobileRecord key={insurance.id} data={insurance} onShowDetail={handleOnClickInsurance} />
                    );
                })
            }

            {totalOpening > 1 ? (
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