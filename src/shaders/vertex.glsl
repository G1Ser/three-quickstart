precision mediump float;
attribute vec3 position;
attribute float aRandom;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// 传递给片元着色器
varying float vRandom;

void main()
{
  vRandom = aRandom;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandom * 0.2;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
} 