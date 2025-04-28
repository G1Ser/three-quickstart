import "./assets/style/style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//scene
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();

//light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.position.set(2, 2, 0);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const debugObject = {
  envMapIntensity: 2.0,
  foxPosition: {
    x: 0,
    y: -0.5,
    z: 0,
  },
  foxRotation: {
    x: 0,
    y: -0.8,
    z: 0,
  },
  foxScale: 0.015,
};
let foxFolder;

//gui
if (import.meta.env.DEV) {
  const gui = new dat.GUI();
  gui
    .add(debugObject, "envMapIntensity")
    .min(0)
    .max(5)
    .step(0.001)
    .name("环境光强度")
    .onChange(() => {
      updateAllMaterials();
    });
  gui.add(directionalLight.position, "x").min(-10).max(10).step(0.001).name("光源位置X");
  gui.add(directionalLight.position, "y").min(-10).max(10).step(0.001).name("光源位置Y");
  gui.add(directionalLight.position, "z").min(-10).max(10).step(0.001).name("光源位置Z");
  gui.add(directionalLight, "intensity").min(0).max(3).step(0.001).name("光源强度");

  // 狐狸控制组
  foxFolder = gui.addFolder("狐狸控制");

  // 位置控制
  foxFolder
    .add(debugObject.foxPosition, "x")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("X位置");
  foxFolder
    .add(debugObject.foxPosition, "z")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("Z位置");

  // 旋转控制
  foxFolder
    .add(debugObject.foxRotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("Y旋转");

  // 缩放控制
  foxFolder
    .add(debugObject, "foxScale")
    .min(0.001)
    .max(0.05)
    .step(0.001)
    .name("缩放");

  foxFolder.open();
}

const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("/src/assets/texture/environment/pure-sky/");
const environmentMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);
scene.background = environmentMap;

//plane
const textureLoader = new THREE.TextureLoader();
const planeBasicColor = textureLoader.load(
  "src/assets/texture/plane/color.jpg"
);
const planeBasicNormal = textureLoader.load(
  "src/assets/texture/plane/normal.jpg"
);
planeBasicColor.wrapS = THREE.RepeatWrapping;
planeBasicNormal.wrapS = THREE.RepeatWrapping;
planeBasicColor.wrapT = THREE.RepeatWrapping;
planeBasicNormal.wrapT = THREE.RepeatWrapping;
planeBasicColor.repeat.set(5, 5);
planeBasicNormal.repeat.set(5, 5);
const planeGeometry = new THREE.CircleGeometry(5, 64);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: planeBasicColor,
  normalMap: planeBasicNormal,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = debugObject.foxPosition.y;
plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;
scene.add(plane);
//model
let foxModel;
let foxAnimation;
let foxMixer;
let foxActions = {};
let activeAction;
gltfLoader.load("src/assets/model/Fox.glb", (gltf) => {
  foxModel = gltf.scene;
  foxAnimation = gltf.animations;
  foxMixer = new THREE.AnimationMixer(foxModel);
  // 创建每个动画的 action
  foxAnimation.forEach((clip) => {
    foxActions[foxAnimationNameMap[clip.name]] = foxMixer.clipAction(clip);
  });
  updateFoxScale();
  updateFoxPosition();
  updateFoxRotation();
  scene.add(foxModel);
  foxModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
    }
  });
  updateAllMaterials();
  // 动画按钮动态添加
  if (import.meta.env.DEV) {
    addAnimationControls(foxFolder, foxAnimation, foxActions);
  }
});
const updateFoxPosition = () => {
  foxModel.position.set(
    debugObject.foxPosition.x,
    debugObject.foxPosition.y,
    debugObject.foxPosition.z
  );
};
const updateFoxRotation = () => {
  foxModel.rotation.set(
    debugObject.foxRotation.x,
    debugObject.foxRotation.y,
    debugObject.foxRotation.z
  );
};
const updateFoxScale = () => {
  foxModel.scale.set(
    debugObject.foxScale,
    debugObject.foxScale,
    debugObject.foxScale
  );
};
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
controls.minDistance = 3;
controls.maxDistance = 5;
controls.minPolarAngle = Math.PI * 0.5;
controls.maxPolarAngle = Math.PI * 0.5;
// 设置水平旋转角度限制
controls.minAzimuthAngle = -Math.PI * 0.5;
controls.maxAzimuthAngle = Math.PI * 0.5;
//renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
    }
  });
};
const clock = new THREE.Clock();
const tick = () => {
  const delta = clock.getDelta();
  if (foxMixer) foxMixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
  if (foxModel) {
    updateFoxScale();
    updateFoxPosition();
    updateFoxRotation();
  }
  window.requestAnimationFrame(tick);
};
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
tick();
const foxAnimationNameMap = {
  Survey: "观察",
  Walk: "行走",
  Run: "奔跑",
};
// 动画控制按钮动态添加函数
function addAnimationControls(foxFolder, foxAnimation, foxActions) {
  // 动画名数组，首位加"无动画"
  const animationNames = ["无动画", ...foxAnimation.map((clip) => foxAnimationNameMap[clip.name])];
  // 当前动画名
  let currentAnimationName = animationNames[0];
  // dat.GUI 绑定对象
  const animObj = { 当前动画: currentAnimationName };

  foxFolder
    .add(animObj, "当前动画", animationNames)
    .name("动画选择")
    .onChange((name) => {
      if (activeAction) activeAction.stop();
      if (name === "无动画") {
        activeAction = null;
        return;
      }
      activeAction = foxActions[name];
      activeAction.reset().play();
      currentAnimationName = name;
    });
}
