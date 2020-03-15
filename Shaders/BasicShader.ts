import Shader from './Shader'
import Material from '../Graphics/Material'
import Matrix from '../Math/Matrix'
import { BuiltinShader } from '../Core/Types'

export default class BasicShader extends Shader {
  public constructor() {
    super(BuiltinShader.BASIC)
    this.load(vertexShaderSource, fragmentShaderSource)
  }

  public applyStandardUniforms(material: Material, model: Matrix, view: Matrix, projection: Matrix): void {
    this.useProgram()
    this.setUniformMatrix('u_model', model)
    this.setUniformMatrix('u_view', view)
    this.setUniformMatrix('u_projection', projection)
    this.setUniformColor('u_tint', material.tint)

    if (material.diffuseTexture === undefined)
      return undefined
    material.diffuseTexture.activateAndBind(0)
    this.setUniformInt('u_diffuse', 0)
  }
}

const vertexShaderSource = `
  attribute vec3 a_position;
  attribute vec2 a_texCoord;

  uniform mat4 u_view;
  uniform mat4 u_model;
  uniform mat4 u_projection;

  varying vec2 v_texCoord;
  void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
  }
`

const fragmentShaderSource = `
  precision mediump float;

  uniform vec4 u_tint;
  uniform sampler2D u_diffuse;

  varying vec2 v_texCoord;

  void main() {
    gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
  }
`