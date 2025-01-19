import React, { memo, useCallback, useState } from 'react';
import styles from './Switch.module.scss';
import { cn } from '@/utils';

type SwitchButtonProps = {
    onChange: () => void;
    defaultValue: boolean;
};

const ToggleSwitch = ({ onChange, defaultValue }: SwitchButtonProps) => {
    const [toggle, setToggle] = useState(defaultValue);

    const handleToggle = useCallback(() => {
        // onChange();
        setToggle(pre => { 
            onChange();
            return !pre; });
    }, []);

    return (
        <label className={styles.switch}>
            <input type="checkbox" checked={toggle} onChange={handleToggle} />
            <span className={cn(styles.slider, styles.round)}></span>
        </label>
    );
};

export default memo(ToggleSwitch);