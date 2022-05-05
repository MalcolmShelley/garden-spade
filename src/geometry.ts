
export function pointInPolygon (point: number[], vs : number[][] | number[], start:number | undefined, end:number | undefined) {
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
