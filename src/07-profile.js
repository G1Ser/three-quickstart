import * as THREE from "three";
import Gradient3 from "./assets/gradients/3.jpg";
import ParticleTexture from "./assets/particle/star.png";

// 获取所有页面和导航点
const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".dot");

// webgl
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 2.5;
cameraGroup.add(camera);
scene.add(cameraGroup);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 3);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load(Gradient3);
const particleTexture = textureLoader.load(ParticleTexture);
gradientTexture.magFilter = THREE.NearestFilter;

const objectXoffset = 1.5;
const objectDistance = 4;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshToonMaterial({
  color: 0xffeded,
  gradientMap: gradientTexture,
});
const cube = new THREE.Mesh(geometry, material);

// 创建莫比乌斯环
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const torusKnot = new THREE.Mesh(torusKnotGeometry, material);

// 创建20面体
const icosahedronGeometry = new THREE.IcosahedronGeometry(0.7, 0);
const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
scene.add(cube, torusKnot, icosahedron);

const geometrySet = [cube, torusKnot, icosahedron];

const particlesCount = 300;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 4;
  positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * geometrySet.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  map: particleTexture,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

geometrySet.forEach((geometry, index) => {
  geometry.position.x = objectXoffset * (index % 2 ? -1 : 1);
  geometry.position.y = -objectDistance * index;
});

const clock = new THREE.Clock();
let scrollY = 0;
let cursor = {
  x: 0,
  y: 0,
};
let perviousTime = 0;

// 添加动画循环;
function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - perviousTime;
  perviousTime = elapsedTime;
  for (const geometry of geometrySet) {
    geometry.rotation.x = elapsedTime * 0.1;
    geometry.rotation.y = elapsedTime * 0.15;
  }
  camera.position.y = (-scrollY / window.innerHeight) * objectDistance;
  const parallaxX = -cursor.x * 0.5;
  const parallaxY = cursor.y * 0.5;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 5;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 5;
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();

// 监听滚动事件
window.addEventListener("scroll", () => {
  // 获取当前滚动位置
  scrollY = window.scrollY;

  // 遍历所有页面
  pages.forEach((page, index) => {
    // 获取页面顶部和底部位置
    const pageTop = page.offsetTop;
    const pageHeight = page.offsetHeight;
    const pageBottom = pageTop + pageHeight;

    // 判断当前滚动位置是否在页面范围内
    if (scrollY >= pageTop && scrollY < pageBottom) {
      // 移除所有导航点的active类
      dots.forEach((dot) => dot.classList.remove("active"));
      // 为当前页面对应的导航点添加active类
      dots[index].classList.add("active");
    }
  });
});

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / window.innerWidth - 0.5;
  cursor.y = e.clientY / window.innerHeight - 0.5;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
