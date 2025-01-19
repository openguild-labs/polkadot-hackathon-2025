/**
 * These constants define the elliptic curve secp256k1, widely used in cryptographic
 * applications, including Bitcoin. The curve operates over a finite field of prime
 * order P, with a base point G of order Q, specified by its coordinates GX and GY.
 */

// secp256k1 constants for elliptic curve cryptography

// The prime modulus of the field
export const P: bigint = 2n ** 256n - 2n ** 32n - 977n;

// The order of the curve
export const Q: bigint = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
);

// X-coordinate of the generator point G
export const GX: bigint = BigInt(
  "0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798",
);

// Y-coordinate of the generator point G
export const GY: bigint = BigInt(
  "0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",
);