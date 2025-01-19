import { Q } from "./constants.js";
import { Point } from "./point.js";

export class Matrix {
  matrix: bigint[][];

  constructor(matrix: bigint[][]) {
    this.matrix = matrix;
  }

  static createVandermonde(indices: bigint[]): Matrix {
    const n = indices.length;
    const matrix = indices.map((x) =>
      Array.from({ length: n }, (_, i) => x ** BigInt(i) % Q),
    );
    return new Matrix(matrix);
  }

  determinant(): bigint {
    if (this.matrix.length === 1) {
      return this.matrix[0]![0]! % Q;
    }
    if (this.matrix.length === 2) {
      return (
        (this.matrix[0]![0]! * this.matrix[1]![1]! -
          this.matrix[0]![1]! * this.matrix[1]![0]!) %
        Q
      );
    }
    let det = 0n;
    for (let c = 0; c < this.matrix.length; c++) {
      const minor = new Matrix(
        this.matrix
          .slice(1)
          .map((row) => [...row.slice(0, c), ...row.slice(c + 1)]),
      );
      det +=
        ((-1n) ** BigInt(c) * this.matrix[0]![c]! * minor.determinant()) % Q;
      det %= Q;
    }
    return det;
  }

  multPointMatrix(Y: Point[][]): Point[][] {
    const result: Point[][] = [];
    for (const aRow of this.matrix) {
      const rowResult: Point[] = [];
      for (let j = 0; j < Y[0]!.length; j++) {
        let sumPoint = new Point(); // Point at infinity
        for (let k = 0; k < aRow.length; k++) {
          const point = Y[k]![j];
          sumPoint = sumPoint.add(point!.multiply(aRow[k]!));
        }
        rowResult.push(sumPoint);
      }
      result.push(rowResult);
    }
    return result;
  }

  inverseMatrix(): Matrix {
    const n = this.matrix.length;
    const adj: bigint[][] = Array.from({ length: n }, () => Array(n).fill(0n));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const minor = new Matrix(
          this.matrix
            .filter((_, x) => x !== i)
            .map((row) => row.filter((_, y) => y !== j)),
        );
        adj[j]![i] = ((-1n) ** BigInt(i + j) * minor.determinant()) % Q;
      }
    }
    const det = this.determinant();
    const detInv = Matrix.modPow(det, Q - 2n, Q);
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        adj[row]![col] = (adj[row]![col]! * detInv) % Q;
      }
    }
    return new Matrix(adj);
  }

  static modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> 1n;
      base = (base * base) % modulus;
    }
    return result;
  }
}