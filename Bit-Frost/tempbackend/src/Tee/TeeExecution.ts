export async function runInTEE<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
    // return runInEnclave(fn);
}

