import { Input, InputProps } from 'antd'
import React from 'react'
import { twMerge } from 'tailwind-merge';
import './searchbar.css'
import SearchIcon from '../icons/SearchIcon';

export default function SearchBar(props: InputProps): React.JSX.Element {
    return (
        <Input
            size='large'
            placeholder='Search'
            allowClear
            prefix={<SearchIcon className='hover:fill-[#1A1D1F]'/>}
            {...props}
            className={twMerge('w-1/3 hover:border-2 rounded-xl h-12 border-2 border-transparent caret-secondary', props.className)}
        />
    )
}
