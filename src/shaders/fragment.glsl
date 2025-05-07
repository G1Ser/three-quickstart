precision mediump float;
uniform sampler2D uTexture;

// 接收顶点着色器传递过来的uv
varying vec2 vUv;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = textureColor;
} 