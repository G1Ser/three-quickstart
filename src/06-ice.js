import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 场景
const scene = new THREE.Scene();

// 纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载纹理 - 基础颜色和位移贴图
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

// 材质 - 使用 MeshPhongMaterial 支持高光贴图
const material = new THREE.MeshPhongMaterial({
  map: colorTexture,
  normalMap: normalTexture,
  // 高光贴图
  specularMap: specularTexture,
  // 高光颜色 - 调整为淡蓝白色，更符合冰面在阳光下的反光
  specular: 0xadd8e6,
  // 增加高光强度，模拟冰面在阳光下的强反光特性
  shininess: 150,
  // 为了保持一致性，也添加位移贴图
  displacementMap: displacementTexture,
  displacementScale: 0.03,
  // 增加一些透明度
  transparent: true,
  opacity: 0.9
});

// 创建几何体
// 1. 平面 - 需要足够的细分以显示位移效果
const planeGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = -3;
// 添加uv2坐标用于环境遮挡贴图
plane.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// 2. 球体 - 同样需要足够的细分
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64); // 64,64提供足够的细分
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
// 添加uv2坐标
sphere.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

// 移除立方体的位移贴图，使用标准材质
const cubeMaterial = new THREE.MeshPhongMaterial({
  map: colorTexture,
  normalMap: normalTexture,
  // 高光贴图
  specularMap: specularTexture,
  // 高光颜色 - 调整为淡蓝白色，更符合冰面在阳光下的反光
  specular: 0xadd8e6,
  // 增加高光强度，模拟冰面在阳光下的强反光特性
  shininess: 150,
  // 增加一些透明度
  transparent: true,
  opacity: 0.9
});

// 还原为普通细分的立方体
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.x = 3;
// 仍然添加uv2坐标，以便将来可能添加aoMap等功能
cube.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(cube.geometry.attributes.uv.array, 2)
);

// 添加物体到场景
scene.add(plane, sphere, cube);

// 灯光 - 模拟阳光直射
// 降低环境光强度，但调整为淡蓝色调，模拟天空光
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.3);
scene.add(ambientLight);

// 创建一个强力方向光模拟阳光
const sunLight = new THREE.DirectionalLight(0xffffeb, 1.5);
sunLight.position.set(5, 10, 7);
scene.add(sunLight);

// 移除或降低之前的点光源亮度，让太阳光成为主要光源
// 保留一个点光源用于补充照明
const pointLight = new THREE.PointLight(0xffffeb, 0.6, 10);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

// 移除其他点光源
// scene.remove(pointLight2);
// scene.remove(pointLight3);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;
scene.add(camera);

// 渲染器
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 添加色调映射以增强视觉效果
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; // 略微增加曝光

// 控制器
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 窗口大小调整
window.addEventListener("resize", () => {
  // 更新相机
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const tick = () => {
  
  // 更新控制器
  controls.update();

  // 渲染
  renderer.render(scene, camera);

  // 下一帧
  window.requestAnimationFrame(tick);
};

// 启动动画循环
tick();
