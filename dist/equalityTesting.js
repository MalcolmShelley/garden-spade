"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testJSONEquality = exports.testArrayEquality = exports.testGeneralEquality = void 0;
function testGeneralEquality(a, b, keyFilter = ["_v", "id", "__v", "_id", "__id"]) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return testArrayEquality(a, b, keyFilter);
    }
    else if (Array.isArray(a) || Array.isArray(b)) {
        return false;
    }
    if (a instanceof Date || b instanceof Date) {
        return Math.abs(new Date(a.toString()).valueOf() - new Date(b.toString()).valueOf()) < 2000;
    }
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
        return testJSONEquality(a, b, keyFilter);
    }
    else if ((typeof a === 'object' && a !== null) || (typeof b === 'object' && b !== null)) {
        return false;
    }
    return a.toString() === b.toString();
}
exports.testGeneralEquality = testGeneralEquality;
function testArrayEquality(a, b, keyFilter = ["_v", "id", "__v", "_id", "__id"]) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!testGeneralEquality(a[i], b[i], keyFilter)) {
                return false;
            }
        }
        return true;
    }
    throw new Error("not an array, cannot test equality");
}
exports.testArrayEquality = testArrayEquality;
function testJSONEquality(a, b, keyFilter = ["_v", "id", "__v", "_id", "__id"]) {
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
        let getKeyList = (o) => {
            return Object.keys(o).sort().filter((v) => {
                return !(keyFilter.includes(v)) && (o[v] !== undefined) && (o[v] !== "") && (o[v] !== "undefined");
            });
        };
        let keys = {
            a: getKeyList(a),
            b: getKeyList(b),
        };
        if (!testArrayEquality(keys.a, keys.b, keyFilter)) {
            return false;
        }
        for (let i = 0; i < keys.a.length; i++) {
            if (!testGeneralEquality(a[keys.a[i]], b[keys.b[i]], keyFilter)) {
                return false;
            }
        }
        return true;
    }
    throw new Error("not an object, cannot test equality");
}
exports.testJSONEquality = testJSONEquality;
//# sourceMappingURL=equalityTesting.js.map