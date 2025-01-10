import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TextTureImg from "./assets/basketball.jpg";
//texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(TextTureImg);
texture.minFilter = THREE.NearestFilter; //让纹理在何种情况下都清晰
//scene
const scene = new THREE.Scene();
//basketball
const geometry = new THREE.SphereGeometry(0.5);
const material = new THREE.MeshBasicMaterial({
  map: texture,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera);
camera.position.z = 3;
const canvas = document.querySelector(".webgl");
//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
tick();
