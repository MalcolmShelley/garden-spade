
const ExistingUIDs = {
    id: 0,
};

/**
 * Generates a session-unique identifier based on a prefix.
 * @param prefix
 * @returns {string}
 * @constructor
 */
export function GenerateUID(prefix = "id") {
    prefix.replace("#", "Hash");
    if (!ExistingUIDs[prefix]) {
        ExistingUIDs[prefix] = 0;
    }
    ExistingUIDs[prefix]++;
    return `${prefix}#${ExistingUIDs[prefix]}`;
}


/**
 * JS implementation of python sleep. Promisified so it can be used to delay a thread
 * @param delay
 * @param fn
 * @param args
 * @returns {Promise<any>}
 */
export async function sleep(delay = 100, fn = undefined, ...args): Promise<void> {
    await timeout(delay);
    if (fn) {
        return fn(...args);
    } else {
        return;
    }
}
function timeout(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * Repeatedly tries to call fn until it returns true or the attempt limit is reached. Will return the output of fn
 * @param {int} delay ms of delay between attempts
 * @param {function} fn function to be called
 * @param {int} attemptLimit max number of attempts
 * @param args arguments for fn
 * @return {Promise<*>}
 */
export async function AttemptOnDelay(delay, attemptLimit = 3, fn, ...args) {
    let attempts = 0;
    let result = false;
    while (attempts < attemptLimit && !result) {
        attempts++;
        await timeout(delay);
        try {
            result = fn(...args);
        } catch (e) {}
    }
    return result;
}
/*
Examples of buffered action:
@ : buffered action is triggered
¤ : buffered action is executed
* : currently running is true
& : pending execution is true
- : time
+ : 5 minutes

execution is when the function is run, triggering is when the buffered action has it's .trigger() called
one character is one minute
period for all examples is 10 minutes

rising edge:
   PendingExec:                    &&&&&                      |
    curRunning:  **********    ********╚************          |
          time: +----+----+----+----+----+----+----+----+     |
    executions:  ¤             ¤        ¤                     |
        events:  @             @    @ @                       |

falling edge:
   PendingExec:                    &&&&&                      |
    curRunning:  **********    ********╚************          |
          time: +----+----+----+----+----+----+----+----+     |
    executions:           ¤             ¤          ¤          |
        events:  @             @    @ @                       |

falling edge and wait for quiet:
   PendingExec:                    &&&&&                      |
    curRunning:  **********    ********╚************          |
          time: +----+----+----+----+----+----+----+----+     |
    executions:           ¤                        ¤          |
        events:  @             @    @ @                       |
 */
export class BufferedAction {
    action: (...args: unknown[]) => void;
    options = {};
    /**
     * Has been triggered and thread therefore currently running
     * @type {boolean}
     */
    currentlyRunning = false;
    /**
     * Has this been triggered more than once in the past <period>?
     * @type {boolean}
     */
    pendingExecution = false;
    args = [];
    period = 200;
    /**
     * If false, this will always wait one period before actually triggering
     * @type {boolean}
     */
    risingEdge = true;

    /**
     * If true, this will wait until no more changes are being made to trigger
     * only works if rising edge is false.
     * @type {boolean}
     */
    waitForQuiet = false;

    /**
     *
     * @param action Function to call when triggered
     * @param period Minimum delay between function calls
     * @param risingEdge Should the first trigger cause the function to execute immediately? Or should it wait for <period> first?
     * @param waitForQuiet If true (and rising edge is false), every trigger will reset the timer to 200ms.
     */
    constructor(action: (...args: unknown[]) => void, period = 200, risingEdge=true, waitForQuiet=false) {
        this.action = action;
        this.period = period;
        this.risingEdge = risingEdge;
        this.waitForQuiet = waitForQuiet;
    }

    interruptCount = 0;
    _execute(): void {
        this.currentlyRunning = true;
        if (this.risingEdge) {
            this.action(...this.args);
        }
        let interruptKey = this.interruptCount;
        setTimeout(() => {
            //if the interruptCount has been incremented during the delay, cancel execution
            if(interruptKey !== this.interruptCount){
                return
            }

            let pendingExecution = this.pendingExecution;
            if (!pendingExecution) {
                this.currentlyRunning = false;
            }
            //If this is a falling edge action
            if (!this.risingEdge) {
                //If we are waiting for quiet and there is no pending task, we should execute
                if (this.waitForQuiet) {
                    if (!pendingExecution) {
                        this.action(...this.args);
                    } else {
                    }
                }
                //If we dont't have to wait for quite, just execute.
                else {
                    this.action(...this.args);
                }
            }

            if (pendingExecution) {
                this.pendingExecution = false;
                this._execute();
            }
        }, this.period);
    }

    trigger(...args: unknown[]): void {
        this.args = args;
        if (!this.currentlyRunning) {
            this._execute();
        } else {
            this.pendingExecution = true;
        }
    }

    /**
     * Immediately executes the function regardless of buffering and clears any pending actions
     * @param args
     */
    forceExecute(...args: unknown[]){
        this.args = args;
        this.forceReset();
        this.action(...this.args);
    }

    /**
     * Stops any queued actions and resets the state.
     */
    forceReset(){
        this.interruptCount++;
        this.pendingExecution = false;
        this.currentlyRunning = false;
    }
}
export function getFirstDefined<T>(...items: (T | undefined)[]): T | undefined{
    for(let i = 0; i < items.length; i++){
        if(items[i] !== undefined){
            return items[i];
        }
    }
    return undefined;
}

/**
 * Returns the value, unless the value is outside the range specified by min max,
 * in which case it returns either min or max based on which is closer
 * @param value
 * @param min
 * @param max
 * @returns {number}
 */
export function clamp(value:number, min:number, max:number) : number{
    return Math.min(Math.max(value, min), max)
}