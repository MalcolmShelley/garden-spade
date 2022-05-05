"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = exports.getRandomItem = exports.getRandomBetween = void 0;
/**
 * Get a random number between two numbers
 *
 * @param min Minimum number
 * @param max Maximum number
 * @returns Random number between min and max
 */
const general_1 = require("./general");
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomBetween = getRandomBetween;
/**
 * Get a random number between two numbers
 *
 * @param min Minimum number
 * @param max Maximum number
 * @returns Random number between min and max
 */
function getRandomItem(...items) {
    return items[(0, general_1.clamp)(Math.round(Math.random() * items.length - .5), 0, items.length - 1)];
}
exports.getRandomItem = getRandomItem;
/**
 * Generate random ID of specified length
 *
 * @param length
 * @returns
 */
function getRandomId(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.getRandomId = getRandomId;
//# sourceMappingURL=random.js.map