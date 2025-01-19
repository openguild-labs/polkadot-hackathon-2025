import { Blog } from '@/@type/blog.type';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Store = {
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    blogs: Blog[];
    setBlogs: (blogs: Blog[]) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPage: number;
    setTotalPage: (total: number) => void;
};

const useBlogStore = create<Store>()(
    immer((set) => ({
        loading: false,
        setLoading(isLoading) {
            set((state) => {
                state.loading = isLoading;
            });
        },
        blogs: [],
        setBlogs(blogs) {
            set((state) => {
                state.blogs = blogs;
            });
        },
        currentPage: 1,
        setCurrentPage(currentPage) {
            set((state) => {
                state.currentPage = currentPage;
            });
        },
        totalPage: 15,
        setTotalPage(totalPage) {
            set((state) => {
                state.totalPage = totalPage;
            });
        },
    })),
);

export default useBlogStore;
