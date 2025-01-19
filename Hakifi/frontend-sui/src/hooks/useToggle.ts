"use client";

import { useState, useCallback } from "react";

// Toggles between true or false
function useToggle(initialValue = false) {
    const [toggle, setToggle] = useState<boolean>(initialValue);

    const handleToggle = useCallback((newStatus?: boolean) => {
        if (newStatus !== undefined) setToggle(newStatus);
        setToggle(status => !status);
    }, []);

    return { toggle, handleToggle };
}

export default useToggle;