import "./assets/style/style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//scene
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();

//light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const debugObject = {
  envMapIntensity: 1.0,
  foxPosition: {
    x: 0,
    y: -1,
    z: 0,
  },
  foxRotation: {
    x: 0,
    y: (-Math.PI * 1) / 3,
    z: 0,
  },
  foxScale: 0.015,
};

//gui
if (import.meta.env.DEV) {
  const gui = new dat.GUI();
  gui
    .add(debugObject, "envMapIntensity")
    .min(0)
    .max(3)
    .step(0.001)
    .onChange(() => {
      updateAllMaterials();
    });
  gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);

  // 狐狸控制组
  const foxFolder = gui.addFolder("狐狸控制");

  // 位置控制
  foxFolder
    .add(debugObject.foxPosition, "x")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("X位置");
  foxFolder
    .add(debugObject.foxPosition, "y")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("Y位置");
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

//model
let foxModel;
gltfLoader.load("src/assets/model/Fox.glb", (gltf) => {
  foxModel = gltf.scene;
  updateFoxScale();
  updateFoxPosition();
  updateFoxRotation();
  scene.add(foxModel);
  updateAllMaterials();
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
//renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
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
updateAllMaterials();
const tick = () => {
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
