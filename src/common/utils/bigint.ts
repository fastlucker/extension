export class BigIntMath {
  static abs(x: bigint): bigint {
    return x < 0 ? -x : x
  }
}
