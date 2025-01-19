interface DebounceFunction {
    (fn: (...args: any[]) => void, delay: number): (...args: any[]) => void;
}

const debounce: DebounceFunction = (fn, delay) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};




export { debounce };