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
  "/src/assets/grass/BaseColor.jpg"
);
const grassAmbientOcclusionTexture = textureLoader.load(
  "/src/assets/grass/AmbientOcclusion.jpg"
);
const grassHeightTexture = textureLoader.load("/src/assets/grass/Height.png");
const grassNormalTexture = textureLoader.load("/src/assets/grass/Normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/src/assets/grass/Roughness.jpg"
);

grassBasicColorTexture.repeat.set(2, 2);
grassAmbientOcclusionTexture.repeat.set(2, 2);
grassHeightTexture.repeat.set(2, 2);
grassNormalTexture.repeat.set(2, 2);
grassRoughnessTexture.repeat.set(2, 2);

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
const planeGemotry = new THREE.PlaneGeometry(20, 20, 20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: grassBasicColorTexture,
  aoMap: grassAmbientOcclusionTexture,
  displacementMap: grassHeightTexture,
  displacementScale: 0.35,
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
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xac8e82 });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);

wall.position.y = 0.5 * 2.5;

// roof
const roofGeometry = new THREE.ConeGeometry(3.5, 1, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xb35f45 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);

roof.position.y = 2.5 + 0.5 * 1;
roof.rotation.y = Math.PI * 0.25;

// add component to house
house.add(wall, roof);

// add object to scene
scene.add(grass, house);
tick();
