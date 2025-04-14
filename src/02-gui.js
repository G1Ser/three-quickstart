import "./assets/style/style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//gui
const gui = new dat.GUI();
//scene
const scene = new THREE.Scene();
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
  },
};
//red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const matrerial = new THREE.MeshBasicMaterial({
  color: parameters.color,
  transparent: true,
  opacity: 0.8,
});
const mesh = new THREE.Mesh(geometry, matrerial);
const edges = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.1,
});
const line = new THREE.LineSegments(edges, edgesMaterial);
const cube = new THREE.Group();
cube.add(mesh);
cube.add(line);
scene.add(cube);
//debug
gui.add(cube.position, "y", -1, 1, 0.01).name("Yaxis");
gui.addColor(parameters, "color").onChange(() => {
  matrerial.color.set(parameters.color);
});
gui.add(parameters, "spin");
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
