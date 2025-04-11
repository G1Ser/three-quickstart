import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import ParticleImg from "./assets/particle/star.png";
import { FlyControls } from "three/addons/controls/FlyControls.js";

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load(ParticleImg);
particleTexture.minFilter = THREE.NearestFilter;

// GUI
const gui = new dat.GUI();
const parameters = {};
parameters.count = 100000;
parameters.size = 0.03;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

// Adjust the parameters
gui
  .add(parameters, "count", 0, 500000, 500)
  .name("galaxyCount")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size", 0, 0.2, 0.01)
  .name("galaxySize")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius", 0, 10, 1)
  .name("galaxyRadius")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches", 3, 10, 1)
  .name("galaxyBranches")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin", 0, 2, 0.01)
  .name("galaxySpin")
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower", 1, 10, 1)
  .name("galaxyRandomnessPower")
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameters, "insideColor")
  .name("galaxyInsideColor")
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameters, "outsideColor")
  .name("galaxyOutsideColor")
  .onFinishChange(generateGalaxy);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 5;
camera.lookAt(0, 0, 0);

scene.add(camera);

// Add Points
const geometry = new THREE.BufferGeometry();
const material = new THREE.PointsMaterial({
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  map: particleTexture,
  vertexColors: true,
});

let points = null;

function generateGalaxy() {
  if (points !== null) {
    scene.remove(points);
  }
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  for (let i = 0; i < parameters.count; i++) {
    const radius = Math.random() * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  material.size = parameters.size;
  points = new THREE.Points(geometry, material);
  scene.add(points);
}

generateGalaxy();

const canvas = document.querySelector(".webgl");
const controls = new FlyControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function tick() {
  controls.update(0.1);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
