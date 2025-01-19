import React from 'react';
import BlogItem from './components/BlogItem';

function BlogList() {
    return (
        <section className="lg:grid lg:grid-cols-4 lg:gap-5 gap-4 flex flex-col ">
            {/* {
                blogs.map(item => {
                    return <BlogItem key={item.createdAt.toString()} blog={item} />;
                })
            } */}
        </section>
    );
}

export default BlogList;