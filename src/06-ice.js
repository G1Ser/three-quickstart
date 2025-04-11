import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 场景
const scene = new THREE.Scene();

// 纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载纹理 - 使用你已有的贴图
const colorTexture = textureLoader.load("./src/assets/texture/ice/color.jpg");
const displacementTexture = textureLoader.load(
  "./src/assets/texture/ice/displacement.png"
);
const normalTexture = textureLoader.load(
  "./src/assets/texture/ice/normal.jpg"
);
const aoTexture = textureLoader.load(
  "./src/assets/texture/ice/occlusion.jpg"
);
const specularTexture = textureLoader.load(
  "./src/assets/texture/ice/specular.jpg"
);

// 纹理设置
colorTexture.minFilter = THREE.LinearFilter;
colorTexture.magFilter = THREE.LinearFilter;
colorTexture.generateMipmaps = false;

// 简化的冰球材质
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(0.5, 0.5),
  displacementMap: displacementTexture,
  displacementScale: 0.2,
  aoMap: aoTexture,
  aoMapIntensity: 1.0,
  roughnessMap: specularTexture,
  roughness: 1,
  metalness: 0,
  // 半透明效果
  transparent: true,
  opacity: 0.5,
  color: 0xeaf5ff // 淡蓝白色
});

// 球体几何体
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, material);
// 添加uv2坐标用于环境遮挡贴图
sphere.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
scene.add(sphere);

// 灯光设置
// 环境光
const ambientLight = new THREE.AmbientLight(0xccddff, 1);
scene.add(ambientLight);

// 主光源
const mainLight = new THREE.DirectionalLight(0xffffff, 5);
mainLight.position.set(2, 2, 2);
scene.add(mainLight);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;
scene.add(camera);

// 渲染器
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 控制器
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 窗口大小调整
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 动画循环
const tick = () => {
  const elapsedTime = Date.now() * 0.001;
  
  // 缓慢旋转冰球
  sphere.rotation.y = elapsedTime * 0.1;
  sphere.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

// 启动动画循环
tick();
