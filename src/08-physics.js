import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GrassColorTexture from "./assets/texture/grasslight-big.jpg";
import "./assets/style/style.css";

// 场景
const scene = new THREE.Scene();

// 辅助器
// const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
// scene.add(gridHelper);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 平行光源（用于产生阴影）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 1);
directionalLight.castShadow = true;
// 设置阴影贴图分辨率
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// 加载草地纹理
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load(GrassColorTexture);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(5, 5);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 3);
camera.lookAt(0, 0, 0);
scene.add(camera);

const canvas = document.querySelector(".webgl");

// 轨道控制器
const orbitControls = new OrbitControls(camera, canvas);

// 球
const sphereRadius = 0.3;
const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0,
  transmission: 0.9, // 透明度
  ior: 1.5, // 折射率 (玻璃约为1.5)
  thickness: 1, // 厚度
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.castShadow = true;
sphereMesh.position.set(0, sphereRadius, 0);

// 平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.set(-Math.PI / 2, 0, 0);
planeMesh.receiveShadow = true;
scene.add(sphereMesh, planeMesh);

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 动画
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};
animate();

// 自适应
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
