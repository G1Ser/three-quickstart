import "./assets/style/style.css";
import * as THREE from "three";
import { ModelScene, FoxModel, ModelGUI } from "@/module/model";
import { Light, Camera, Renderer, Controls, Loader } from "@/utils";

// 创建基础组件
const scene = new ModelScene();
const loader = new Loader();
const canvas = document.querySelector(".webgl");
const camera = new Camera().setPosition(0, 0, 3);
const renderer = new Renderer(canvas, { shadowMap: true });
const controls = new Controls(camera.getCamera(), canvas)
  .setDistance(3, 5)
  .setPolarAngle(Math.PI * 0.5, Math.PI * 0.5)
  .setAzimuthAngle(-Math.PI * 0.5, Math.PI * 0.5);
const fox = new FoxModel();

// 调试对象
const debugObject = {
  envMapIntensity: 2.0,
  foxPosition: { x: 0, y: -0.5, z: 0 },
  foxRotation: { x: 0, y: -0.8, z: 0 },
  foxScale: 0.015,
};

// 加载资源
const environmentMap = loader.loadCubeTexture(
  ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
  "/src/assets/texture/environment/pure-sky/"
);

// 设置场景
scene.setBackground(environmentMap);
scene.setEnvironmentMap(environmentMap);
scene.addObject(camera.getCamera());

// 创建光源
const directionalLight = new Light("directional", 0xffffff, 1, {
  castShadow: true,
  position: { x: 2, y: 2, z: 0 },
  shadowMapSize: 1024,
});
scene.addObject(directionalLight.getLight());

// 创建地面
const planeGeometry = new THREE.CircleGeometry(5, 64);
const planeBasicColor = loader.loadTexture(
  "src/assets/texture/plane/color.jpg"
);
const planeBasicNormal = loader.loadTexture(
  "src/assets/texture/plane/normal.jpg"
);

[planeBasicColor, planeBasicNormal].forEach((texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
});

const plane = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshStandardMaterial({
    map: planeBasicColor,
    normalMap: planeBasicNormal,
  })
);
plane.position.y = debugObject.foxPosition.y;
plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;
scene.addObject(plane);

// 加载Fox模型
loader.loadGLTF("src/assets/model/Fox.glb", (gltf) => {
  fox.setModel(gltf.scene, gltf.animations);
  updateFoxTransform();
  scene.addObject(fox.getModel());
  scene.updateAllMaterials();
});

if (import.meta.env.DEV) {
  const gui = new ModelGUI(scene, debugObject, directionalLight, fox);
  gui.setup();
}

// 更新Fox变换
function updateFoxTransform() {
  fox
    .setPosition(
      debugObject.foxPosition.x,
      debugObject.foxPosition.y,
      debugObject.foxPosition.z
    )
    .setRotation(
      debugObject.foxRotation.x,
      debugObject.foxRotation.y,
      debugObject.foxRotation.z
    )
    .setScale(debugObject.foxScale);
}

// 动画循环
const clock = new THREE.Clock();
function tick() {
  const delta = clock.getDelta();

  fox.updateMixer(delta);
  controls.update();
  renderer.render(scene.getScene(), camera.getCamera());

  if (fox.getModel()) updateFoxTransform();

  requestAnimationFrame(tick);
}

// 窗口大小变化处理
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateAspect(window.innerWidth / window.innerHeight);
});

// 开始动画循环
tick();
