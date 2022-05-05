/**
 * Generates a session-unique identifier based on a prefix.
 * @param prefix
 * @returns {string}
 * @constructor
 */
export declare function GenerateUID(prefix?: string): string;
/**
 * JS implementation of python sleep. Promisified so it can be used to delay a thread
 * @param delay
 * @param fn
 * @param args
 * @returns {Promise<any>}
 */
export declare function sleep(delay?: number, fn?: any, ...args: any[]): Promise<void>;
/**
 * Repeatedly tries to call fn until it returns true or the attempt limit is reached. Will return the output of fn
 * @param {int} delay ms of delay between attempts
 * @param {function} fn function to be called
 * @param {int} attemptLimit max number of attempts
 * @param args arguments for fn
 * @return {Promise<*>}
 */
export declare function AttemptOnDelay(delay: any, attemptLimit: number, fn: any, ...args: any[]): Promise<boolean>;
export declare class BufferedAction {
    action: (...args: unknown[]) => void;
    options: {};
    /**
     * Has been triggered and thread therefore currently running
     * @type {boolean}
     */
    currentlyRunning: boolean;
    /**
     * Has this been triggered more than once in the past <period>?
     * @type {boolean}
     */
    pendingExecution: boolean;
    args: any[];
    period: number;
    /**
     * If false, this will always wait one period before actually triggering
     * @type {boolean}
     */
    risingEdge: boolean;
    /**
     * If true, this will wait until no more changes are being made to trigger
     * only works if rising edge is false.
     * @type {boolean}
     */
    waitForQuiet: boolean;
    /**
     *
     * @param action Function to call when triggered
     * @param period Minimum delay between function calls
     * @param risingEdge Should the first trigger cause the function to execute immediately? Or should it wait for <period> first?
     * @param waitForQuiet If true (and rising edge is false), every trigger will reset the timer to 200ms.
     */
    constructor(action: (...args: unknown[]) => void, period?: number, risingEdge?: boolean, waitForQuiet?: boolean);
    interruptCount: number;
    _execute(): void;
    trigger(...args: unknown[]): void;
    /**
     * Immediately executes the function regardless of buffering and clears any pending actions
     * @param args
     */
    forceExecute(...args: unknown[]): void;
    /**
     * Stops any queued actions and resets the state.
     */
    forceReset(): void;
}
export declare function getFirstDefined<T>(...items: (T | undefined)[]): T | undefined;
/**
 * Returns the value, unless the value is outside the range specified by min max,
 * in which case it returns either min or max based on which is closer
 * @param value
 * @param min
 * @param max
 * @returns {number}
 */
export declare function clamp(value: number, min: number, max: number): number;
