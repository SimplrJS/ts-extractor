// Class implements another class.

export class Point {
    x: number;
    y: number;
}

export class Point3d implements Point {
    x: number;
    y: number;
    z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
