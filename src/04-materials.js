import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import BasicMaterial from "./assets/door/color.jpg";
import AlphaMaterial from "./assets/door/alpha.jpg";
import AmbientMaterial from "./assets/door/ambientOcclusion.jpg";
import DisplaymentMaterial from "./assets/door/height.jpg";
import MetalnessMaterial from "./assets/door/metalness.jpg";
import RoughnessMaterial from "./assets/door/roughness.jpg";
import NormalMaterial from "./assets/door/normal.jpg";
//texture
const textureLoader = new THREE.TextureLoader();
const basicTexture = textureLoader.load(BasicMaterial);
const alphaTexture = textureLoader.load(AlphaMaterial);
const ambientTexture = textureLoader.load(AmbientMaterial);
const heightTexture = textureLoader.load(DisplaymentMaterial);
const metalnessTexture = textureLoader.load(MetalnessMaterial);
const roughnessTexture = textureLoader.load(RoughnessMaterial);
const normalTexture = textureLoader.load(NormalMaterial);
basicTexture.minFilter = THREE.NearestFilter; //让纹理在何种情况下都清晰
basicTexture.generateMipmaps = false;
//scene
const scene = new THREE.Scene();
//light
const ambientLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);
//plane
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const material = new THREE.MeshStandardMaterial();
material.map = basicTexture; //添加基础材质
//添加透明通道
material.transparent = true;
material.alphaMap = alphaTexture;
material.aoMap = ambientTexture; //添加环境纹理
//添加高度细节
material.displacementMap = heightTexture;
material.displacementScale = 0.05;
//添加粗糙度细节
material.metalness = 0.1;
material.roughness = 0.8;
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;
const door = new THREE.Mesh(geometry, material);
scene.add(door);
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera);
camera.position.z = 1;
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
