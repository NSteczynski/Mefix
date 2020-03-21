import Vector3 from './Vector3'

/** Represents a matrix 4x4. */
export default class Matrix {
  private _data: Array<number> = []

  /** Prevent creating new class. */
  private constructor() {
    this._data = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]
  }

  /** Returns the data contained in matrix as an array of numbers. */
  public get data(): Array<number> {
    return this._data
  }

  /** Creates and returns an identity matrix. */
  public static identity(): Matrix {
    return new Matrix()
  }

  /**
   * Creates and returns a new orthographic projection matrix.
   * @param left The left extents of the viewport.
   * @param right The right extents of the viewport.
   * @param bottom The bottom extents of the viewport.
   * @param top The top extents of the viewport.
   * @param nearClip The near clipping plane.
   * @param farClip The far clipping plane.
   */
  public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix {
    const matrix = new Matrix()

    matrix._data[0]  =  2 / (right - left)
    matrix._data[5]  =  2 / (top - bottom)
    matrix._data[10] = -2 / (farClip - nearClip)

    matrix._data[12] = - (right + left) / (right - left)
    matrix._data[13] = - (top + bottom) / (top - bottom)
    matrix._data[14] = - (farClip + nearClip) / (farClip - nearClip)

    return matrix
  }

  /**
   * Creates and returns a new perspective projection matrix.
   * @param fov The field of view in radians.
   * @param aspect The aspect ratio.
   * @param nearClip The near clipping plane distance.
   * @param farClip The far clipping plane distance.
   */
  public static perspective(fov: number, aspect: number, nearClip: number, farClip: number): Matrix {
    const matrix = new Matrix()

    const newFov = 1.0 / Math.tan(fov / 2.0)
    const rangeInv = 1.0 / (nearClip - farClip)
    const nfa = newFov / aspect
    const nfr = (nearClip + farClip) * rangeInv
    const nfm = nearClip * farClip * rangeInv * 2.0
    matrix._data = [
      nfa, 0.0   , 0.0,  0.0,
      0.0, newFov, 0.0,  0.0,
      0.0, 0.0   , nfr, -1.0,
      0.0, 0.0   , nfm,  0.0
    ]

    return matrix
  }

  /**
   * Creates a transformation matrix using the provided position.
   * @param position The position to be used in transformation.
   */
  public static translation(position: Vector3): Matrix {
    const matrix = new Matrix()

    matrix._data[12] = position.x
    matrix._data[13] = position.y
    matrix._data[14] = position.z

    return matrix
  }

  /**
   * Creates a rotation matrix on the X axis from the provided angle in radians.
   * @param angleInRadians The angle in radians.
   */
  public static rotationX(angleInRadians: number): Matrix {
    const matrix = new Matrix()

    const cosinus = Math.cos(angleInRadians)
    const sinus = Math.sin(angleInRadians)
    matrix._data[5] = cosinus
    matrix._data[6] = sinus
    matrix._data[9] = -sinus
    matrix._data[10] = cosinus

    return matrix
  }

  /**
   * Creates a rotation matrix on the Y axis from the provided angle in radians.
   * @param angleInRadians The angle in radians.
   */
  public static rotationY(angleInRadians: number): Matrix {
    const matrix = new Matrix()

    const cosinus = Math.cos(angleInRadians)
    const sinus = Math.sin(angleInRadians)
    matrix._data[0] = cosinus
    matrix._data[2] = -sinus
    matrix._data[8] = sinus
    matrix._data[10] = cosinus

    return matrix
  }

  /**
   * Creates a rotation matrix on the Z axis from the provided angle in radians.
   * @param angleInRadians The angle in radians.
   */
  public static rotationZ(angleInRadians: number): Matrix {
    const matrix = new Matrix()

    const cosinus = Math.cos(angleInRadians)
    const sinus = Math.sin(angleInRadians)
    matrix._data[0] = cosinus
    matrix._data[1] = sinus
    matrix._data[4] = -sinus
    matrix._data[5] = cosinus

    return matrix
  }

  /**
   * Creates a rotation matrix from the provided angles in radians.
   * @param angleInRadians The angle in Vector 3 (radians) that contains x, y, z.
   */
  public static rotation(angleInRadians: Vector3): Matrix {
    const rotationX = Matrix.rotationX(angleInRadians.x)
    const rotationY = Matrix.rotationY(angleInRadians.y)
    const rotationZ = Matrix.rotationZ(angleInRadians.z)

    return Matrix.multiply(Matrix.multiply(rotationZ, rotationY), rotationX)
  }

  /**
   * Creates a scale matrix.
   * @param scale The scale to use.
   */
  public static scale(scale: Vector3): Matrix {
    const matrix = new Matrix()

    matrix._data[0]  = scale.x
    matrix._data[5]  = scale.y
    matrix._data[10] = scale.z

    return matrix
  }

  /**
   * Multiplies matrix a by matrix b and returns the result.
   * @param a The first matrix.
   * @param b The second matrix.
   */
  public static multiply(a: Matrix, b: Matrix): Matrix {
    const matrix = new Matrix()

    const b00 = b._data[0 * 4 + 0]
    const b01 = b._data[0 * 4 + 1]
    const b02 = b._data[0 * 4 + 2]
    const b03 = b._data[0 * 4 + 3]
    const b10 = b._data[1 * 4 + 0]
    const b11 = b._data[1 * 4 + 1]
    const b12 = b._data[1 * 4 + 2]
    const b13 = b._data[1 * 4 + 3]
    const b20 = b._data[2 * 4 + 0]
    const b21 = b._data[2 * 4 + 1]
    const b22 = b._data[2 * 4 + 2]
    const b23 = b._data[2 * 4 + 3]
    const b30 = b._data[3 * 4 + 0]
    const b31 = b._data[3 * 4 + 1]
    const b32 = b._data[3 * 4 + 2]
    const b33 = b._data[3 * 4 + 3]
    const a00 = a._data[0 * 4 + 0]
    const a01 = a._data[0 * 4 + 1]
    const a02 = a._data[0 * 4 + 2]
    const a03 = a._data[0 * 4 + 3]
    const a10 = a._data[1 * 4 + 0]
    const a11 = a._data[1 * 4 + 1]
    const a12 = a._data[1 * 4 + 2]
    const a13 = a._data[1 * 4 + 3]
    const a20 = a._data[2 * 4 + 0]
    const a21 = a._data[2 * 4 + 1]
    const a22 = a._data[2 * 4 + 2]
    const a23 = a._data[2 * 4 + 3]
    const a30 = a._data[3 * 4 + 0]
    const a31 = a._data[3 * 4 + 1]
    const a32 = a._data[3 * 4 + 2]
    const a33 = a._data[3 * 4 + 3]

    matrix._data[0]  = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    matrix._data[1]  = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    matrix._data[2]  = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    matrix._data[3]  = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    matrix._data[4]  = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    matrix._data[5]  = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    matrix._data[6]  = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    matrix._data[7]  = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    matrix._data[8]  = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    matrix._data[9]  = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    matrix._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    matrix._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    matrix._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    matrix._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    matrix._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    matrix._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

    return matrix
  }

  /**
   * Inverses the provided matrix.
   * @param m The matrix that will be inversed.
   */
  public static inverse(m: Matrix): Matrix {
    const matrix = Matrix.identity()

    const m00 = m._data[0 * 4 + 0]
    const m01 = m._data[0 * 4 + 1]
    const m02 = m._data[0 * 4 + 2]
    const m03 = m._data[0 * 4 + 3]
    const m10 = m._data[1 * 4 + 0]
    const m11 = m._data[1 * 4 + 1]
    const m12 = m._data[1 * 4 + 2]
    const m13 = m._data[1 * 4 + 3]
    const m20 = m._data[2 * 4 + 0]
    const m21 = m._data[2 * 4 + 1]
    const m22 = m._data[2 * 4 + 2]
    const m23 = m._data[2 * 4 + 3]
    const m30 = m._data[3 * 4 + 0]
    const m31 = m._data[3 * 4 + 1]
    const m32 = m._data[3 * 4 + 2]
    const m33 = m._data[3 * 4 + 3]

    matrix._data[0]  = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33
    matrix._data[1]  = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33
    matrix._data[2]  = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33
    matrix._data[3]  = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23
    matrix._data[4]  = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33
    matrix._data[5]  = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33
    matrix._data[6]  = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33
    matrix._data[7]  = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23
    matrix._data[8]  = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33
    matrix._data[9]  = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33
    matrix._data[10] = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33
    matrix._data[11] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23
    matrix._data[12] = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32
    matrix._data[13] = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32
    matrix._data[14] = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32
    matrix._data[15] = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22

    const scale = 1.0 / Matrix.determinant(m)
    matrix._data = matrix._data.map(data => data * scale)

    return matrix
  }

  /**
   * Determinats the provided matrix.
   * @param m The matrix to calculate determinant.
   */
  public static determinant(m: Matrix): number {
    const m00 = m._data[0 * 4 + 0]
    const m01 = m._data[0 * 4 + 1]
    const m02 = m._data[0 * 4 + 2]
    const m03 = m._data[0 * 4 + 3]
    const m10 = m._data[1 * 4 + 0]
    const m11 = m._data[1 * 4 + 1]
    const m12 = m._data[1 * 4 + 2]
    const m13 = m._data[1 * 4 + 3]
    const m20 = m._data[2 * 4 + 0]
    const m21 = m._data[2 * 4 + 1]
    const m22 = m._data[2 * 4 + 2]
    const m23 = m._data[2 * 4 + 3]
    const m30 = m._data[3 * 4 + 0]
    const m31 = m._data[3 * 4 + 1]
    const m32 = m._data[3 * 4 + 2]
    const m33 = m._data[3 * 4 + 3]

    const value = m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30 +
                  m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31 +
                  m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31 +
                  m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32 +
                  m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33 +
                  m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33
    return value
  }

  /** Returns the data of matrix as a Float32Array. */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this._data)
  }
}