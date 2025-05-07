precision mediump float;

// 接收顶点着色器传递过来的随机值
varying float vRandom;

void main()
{
  gl_FragColor = vec4(1.0, vRandom, 0.0, 1.0);
} 