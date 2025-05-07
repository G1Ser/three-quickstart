import '@assets/style/style.css';
import { Scene, Camera, Renderer, Controls, Loader } from '@/utils';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvas = document.querySelector('.webgl');

const scene = new Scene();
const camera = new Camera().setPosition(0, 0, 3);
const renderer = new Renderer(canvas, { antialias: true });
const controls = new Controls(camera.getCamera(), canvas);
const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
const loader = new Loader();
const flagTexture = loader.loadTexture('src/assets/texture/flag-french.jpg');

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(5, 2) },
    uTime: { value: 0 },
    uTexture: { value: flagTexture },
  },
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
scene.addObject(plane);
scene.addObject(camera.getCamera());

const clock = new THREE.Clock();

function tick() {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  controls.update();
  renderer.render(scene.getScene(), camera.getCamera());

  requestAnimationFrame(tick);
}

// 窗口大小变化处理
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateAspect(window.innerWidth / window.innerHeight);
});

// 开始动画循环
tick();
