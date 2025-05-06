import "@assets/style/style.css";
import { Scene, Camera, Renderer, Controls } from "@/utils";
import * as THREE from "three";
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const canvas = document.querySelector(".webgl");

const scene = new Scene();
const camera = new Camera().setPosition(0, 0, 3);
const renderer = new Renderer(canvas, { antialias: true });
const controls = new Controls(camera.getCamera(), canvas);
const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
});
const plane = new THREE.Mesh(geometry, material);
scene.addObject(plane);
scene.addObject(camera.getCamera());

function tick() {
  controls.update();
  renderer.render(scene.getScene(), camera.getCamera());

  requestAnimationFrame(tick);
}

// 窗口大小变化处理
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateAspect(window.innerWidth / window.innerHeight);
});

// 开始动画循环
tick();
