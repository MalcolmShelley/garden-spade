export declare function pointInPolygon(point: number[], vs: number[][] | number[], start?: number | undefined, end?: number | undefined): boolean;
/**
 * Computes 1D K means and refines them over a certain number of cycles.
 * @param x data array
 * @param n number of means
 * @param cycles number of itterations
 * @returns {{val: number, vals: number[]}[]}
 */
export declare function iterativelyComputeKMeans(x: number[], n: number, cycles?: number): {
    val: number;
    vals: number[];
}[];
