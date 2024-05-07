export async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<any>[] = [];

    for (const task of tasks) {
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
        
        const promise = task();
        results.push(await promise.catch(e => { throw e; }));

        const promiseCleanup = promise.finally(() => {
            const index = executing.indexOf(promiseCleanup);
            if (index > -1) {
                executing.splice(index, 1);
            }
        });
        executing.push(promiseCleanup);
    }

    await Promise.all(executing);
    return results;
}
