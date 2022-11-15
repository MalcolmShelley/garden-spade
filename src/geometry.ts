
export function pointInPolygon (point: number[], vs : number[][] | number[], start:number | undefined = undefined, end:number | undefined = undefined) {
    if (vs.length > 0 && Array.isArray(vs[0])) {
        // @ts-ignore
        return pointInPolygonNested(point, vs, start, end);
    } else if(vs.length > 0 && !Array.isArray(vs[0])) {
        // @ts-ignore
        return pointInPolygonFlat(point, vs, start, end);
    }
}

function pointInPolygonFlat (point: number[], vs : number[], start:number | undefined, end:number | undefined) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) {start = 0;}
    if (end === undefined) {end = vs.length;}
    var len = (end-start)/2;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[start + i * 2], yi = vs[start+i*2+1];
        var xj = vs[start + j * 2], yj = vs[start+j*2+1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {inside = !inside;}
    }
    return inside;
}


function pointInPolygonNested (point: number[], vs : number[][], start:number | undefined, end:number | undefined) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) {start = 0;}
    if (end === undefined) {end = vs.length;}
    var len = end - start;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i+start][0], yi = vs[i+start][1];
        var xj = vs[j+start][0], yj = vs[j+start][1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {inside = !inside;}
    }
    return inside;
}

let meansEntry
/**
 *
 * @param x data to find clusters of
 * @param n number of means to generate
 * @param means starting means
 * @returns {any[]}
 */
function calculateKMeansOnce(x:number[], n:number, means?:{val:number; vals: number[]}[]) :{val:number; vals: number[]}[] {

    // A simple average function, just because
    // JavaScript doesn't provide one by default.
    function avg(x) {
        var s = 0;
        for (var i = 0; i < x.length; i++) {
            s += x[i];
        }
        return (x.length > 0) ? (s / x.length) : 0;
    }

    // n is the number of means to choose.
    if (n === 0) {
        throw new Error('The number of means must be non-zero');
    } else if (n > x.length) {
        throw new Error('The number of means must be fewer than the length of the dataset');
    }

    var seen = {};

    if (!means) {
        means = [];
        // Randomly choose k means from the data and make sure that no point
        // is chosen twice. This bit inspired by polymaps
        while (means.length < n) {
            var idx = Math.floor(Math.random() * (x.length - 1));
            if (!seen[idx]) {
                means.push({ val: x[idx], vals: [] });
                seen[idx] = true;
            }
        }
    }

    var i;
    // For every value, find the closest mean and add that value to the
    // mean's `vals` array.
    for (i = 0; i < x.length; i++) {
        var dists = [];
        for (var j = 0; j < means.length; j++) {
            dists.push(Math.abs(x[i] - means[j].val));
        }
        var closest_index = dists.indexOf(Math.min.apply(null, dists));
        means[closest_index].vals.push(x[i]);
    }

    // Create new centers from the centroids of the values in each
    // group.
    //
    // > In the case of one-dimensional data, such as the test scores,
    // the centroid is the arithmetic average of the values
    // of the points in a cluster.
    //
    // [Vance Faber](http://bit.ly/LHCh2y)
    var newvals = [];
    for (i = 0; i < means.length; i++) {
        var centroid = avg(means[i].vals);
        newvals.push({
            val: centroid,
            vals: []
        });
    }

    return newvals;
}

/**
 * Computes 1D K means and refines them over a certain number of cycles.
 * @param x data array
 * @param n number of means
 * @param cycles number of itterations
 * @returns {{val: number, vals: number[]}[]}
 */
export function iterativelyComputeKMeans(x:number[], n:number, cycles=5):{val:number; vals: number[]}[]{
    let means = calculateKMeansOnce(x, n);
    for(let i = 0; i < cycles; i++){
        means = calculateKMeansOnce(x, n, means);
    }
    return means;
}