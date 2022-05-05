/**
 * Get a random number between two numbers
 *
 * @param min Minimum number
 * @param max Maximum number
 * @returns Random number between min and max
 */
import {clamp} from "./general";

export function getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
/**
 * Get a random number between two numbers
 *
 * @param min Minimum number
 * @param max Maximum number
 * @returns Random number between min and max
 */
export function getRandomItem<T>(...items : T[]): T {
    return items[clamp(
        Math.round(Math.random() * items.length - .5),
        0,
        items.length - 1
    )];

}
/**
 * Generate random ID of specified length
 *
 * @param length
 * @returns
 */
export function getRandomId(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}