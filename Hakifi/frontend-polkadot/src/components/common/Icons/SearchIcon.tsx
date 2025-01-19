import React from 'react';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path fill="#A1A1A1" d="M4.223 6.444v8.89H2v-8.89zM19.778 6.445v8.889h-2.222v-8.89zM15.333 2v2.222H6.444V2zM15.333 17.555v2.222H6.444v-2.222zM6.445 4.222v2.222H4.223V4.222zM17.555 4.222v2.222h-2.222V4.222zM6.445 15.333v2.222H4.223v-2.222z" />
            <path fill="#A1A1A1" d="M17.556 15.333v2.222h-2.222v-2.222zM19.778 17.556v2.222h-2.222v-2.222zM22 19.778V22h-2.222v-2.222z" />
        </svg>
    );
};

export default SearchIcon;
