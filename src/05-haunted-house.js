import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// scene
const scene = new THREE.Scene();

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// add light to scene
scene.add(ambientLight);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// set camera position
camera.position.set(4, 2, 5);
// add camera to scene
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// animation
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

// texture loader
const textureLoader = new THREE.TextureLoader();
const grassBasicColorTexture = textureLoader.load(
  "/src/assets/texture/grass/baseColor.jpg"
);
const wallBasicColorTexture = textureLoader.load(
  "/src/assets/texture/wall/baseColor.png"
);
const doorBasicColorTexture = textureLoader.load(
  "/src/assets/texture/door/baseColor.jpg"
);
const doorAlphaTexture = textureLoader.load("/src/assets/texture/door/alpha.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/src/assets/texture/grass/ambientOcclusion.jpg"
);
const wallAmbientOcclusionTexture = textureLoader.load(
  "/src/assets/texture/wall/ambientOcclusion.png"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "/src/assets/texture/door/ambientOcclusion.jpg"
);
const grassHeightTexture = textureLoader.load(
  "/src/assets/texture/grass/height.png"
);
const doorHeightTexture = textureLoader.load(
  "/src/assets/texture/door/height.jpg"
);
const grassNormalTexture = textureLoader.load(
  "/src/assets/texture/grass/normal.jpg"
);
const doorNormalTexture = textureLoader.load(
  "/src/assets/texture/door/normal.jpg"
);
const wallNormalTexture = textureLoader.load(
  "/src/assets/texture/wall/normal.png"
);
const grassRoughnessTexture = textureLoader.load(
  "/src/assets/texture/grass/roughness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/src/assets/texture/door/roughness.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "/src/assets/texture/door/metalness.jpg"
);

grassBasicColorTexture.repeat.set(4, 4);
grassAmbientOcclusionTexture.repeat.set(4, 4);
grassHeightTexture.repeat.set(4, 4);
grassNormalTexture.repeat.set(4, 4);
grassRoughnessTexture.repeat.set(4, 4);

grassBasicColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassHeightTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassBasicColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassHeightTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// grass
const planeGemotry = new THREE.PlaneGeometry(20, 20, 40, 40);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: grassBasicColorTexture,
  aoMap: grassAmbientOcclusionTexture,
  displacementMap: grassHeightTexture,
  displacementScale: 0.2,
  normalMap: grassNormalTexture,
  roughnessMap: grassRoughnessTexture,
});
const grass = new THREE.Mesh(planeGemotry, planeMaterial);
grass.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(grass.geometry.attributes.uv.array, 2)
);
grass.rotation.x = -Math.PI / 2;

// house
const house = new THREE.Group();

// wall
const wallGeometry = new THREE.BoxGeometry(4, 2.5, 4);
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallBasicColorTexture,
  aoMap: wallAmbientOcclusionTexture,
  normalMap: wallNormalTexture,
});
const wall = new THREE.Mesh(wallGeometry, wallMaterial);

wall.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
);

wall.position.y = 0.5 * 2.5;

// roof
const roofGeometry = new THREE.ConeGeometry(3.5, 1, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: wallBasicColorTexture
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);

roof.position.y = 2.5 + 0.5 * 1;
roof.rotation.y = Math.PI * 0.25;

// door
const doorGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorBasicColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  aoMap: doorAmbientOcclusionTexture,
  normalMap: doorNormalTexture,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  roughnessMap: doorRoughnessTexture,
  metalnessMap: doorMetalnessTexture,
});
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 0.5 * 2 - 0.1;
door.position.z = 2;

// add component to house
house.add(wall, roof, door);

// bush
const bush = new THREE.Group();
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x89c854,
});
// 创建四个灌木丛
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.4, 0.4, 0.4);
bush2.position.set(1.6, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.6, 0.6, 0.6);
bush3.position.set(-1, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.3, 0.3, 0.3);
bush4.position.set(-1.6, 0.05, 2.2);

bush.add(bush1, bush2, bush3, bush4);

// add object to scene
scene.add(house, grass, bush);
tick();
