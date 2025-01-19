import { useCallback, useState } from 'react';
type SortType = {
    field: string; desc: boolean | string;
};
const useSorting = () => {
    const [sorting, setSorting] = useState<{
        field: string; desc: boolean | string;
    }[]>([]);
    const handleSorting = (status: string | boolean) => {
        switch (status) {
            case '':
                return true;
            case true:
                return false;
            default:
                return '';
        }
    };

    const handleSortFunc = ((field: string) => {
        if (sorting.length > 1) setSorting(pre => pre.slice(1, 1));

        const index = sorting.findIndex(item => item.field === field);
        if (index !== -1) {
            const sort = handleSorting(sorting[index].desc);
            const temp = { ...sorting[index], desc: sort };
            setSorting(
                [temp]
            );
        } else {
            // const sort = 
            setSorting([{ field, desc: true }]);
        }
    }) as (field: string) => void;

    const getSort = useCallback((field: string) => {
        return sorting.find(item => item.field === field);
    }, [sorting]);

    return { getSort, handleSortFunc, sorting };
};

export default useSorting;