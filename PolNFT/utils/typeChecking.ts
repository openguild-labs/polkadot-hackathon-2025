export function isUndefined(value: any): value is undefined {
    return typeof value === 'undefined';
}

export function isAsyncFunction(func: Function | undefined): func is () => Promise<any> {
    if (!func)
        return false;
    return func.constructor.name === 'AsyncFunction';
}
