import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GrassColorTexture from "./assets/texture/grasslight-big.jpg";
import CANNON from "cannon";
import * as dat from "dat.gui";
import "./assets/style/style.css";

// 调试工具
const gui = new dat.GUI();
const parameters = {
  applyWind: false,
  windForce: 1,
  resetBall: () => {
    sphereBody.position.set(0, 2, 0);
    sphereBody.velocity.set(0, 0, 0);
    sphereBody.angularVelocity.set(0, 0, 0);
  },
};

// 添加风力控制
gui
  .add(parameters, "applyWind")
  .name("开启风力");
gui.add(parameters, "windForce", 1, 30).name("风力大小");
gui.add(parameters, "resetBall").name("重置球体");

// 场景
const scene = new THREE.Scene();

// 物理场景
const world = new CANNON.World();
// 设置重力
world.gravity.set(0, -9.82, 0);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 平行光源（用于产生阴影）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 1);
directionalLight.castShadow = true;
// 设置阴影贴图分辨率
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// 加载草地纹理
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load(GrassColorTexture);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(5, 5);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 8, 5);
camera.lookAt(0, 0, 0);
scene.add(camera);

const canvas = document.querySelector(".webgl");

// 轨道控制器
const orbitControls = new OrbitControls(camera, canvas);

// 构建球体
const createShpere = (radius, color) => {
  // 球体高度
  const height = 2;
  // 场景球体
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.1,
    roughness: 0,
    transmission: 0.9, // 透明度
    ior: 1.5, // 折射率 (玻璃约为1.5)
    thickness: 1, // 厚度
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.castShadow = true;
  sphereMesh.position.set(0, height, 0);
  // 物理球体
  const sphereShape = new CANNON.Sphere(radius);
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
    position: new CANNON.Vec3(0, height, 0),
    linearDamping: 0.5
  });
  world.addBody(sphereBody);
  return { sphereMesh, sphereBody };
};
// 构建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
});
const createPlane = () => {
  const quaternion = -Math.PI / 2;
  // 场景平面
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.set(quaternion, 0, 0);
  planeMesh.receiveShadow = true;
  // 物理平面
  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape
  });
  planeBody.quaternion.setFromEuler(quaternion, 0, 0);
  world.addBody(planeBody);
  return { planeMesh, planeBody };
};

// 球
const { sphereMesh, sphereBody } = createShpere(0.3, 0xffffff);
const { planeMesh, planeBody } = createPlane();

scene.add(sphereMesh, planeMesh);

// physics material
const spherePhysicsMaterial = new CANNON.Material("sphere");
const planePhysicsMaterial = new CANNON.Material("plane");

// 设置小球和地面中间的弹撞系数
const contactMaterial = new CANNON.ContactMaterial(
  spherePhysicsMaterial,
  planePhysicsMaterial,
  {
    restitution: 0.6, //弹性系数
    friction: 0.4, //摩擦系数
  }
);
world.addContactMaterial(contactMaterial);

// 小球和地面中间的弹撞系数
sphereBody.material = spherePhysicsMaterial;
planeBody.material = planePhysicsMaterial;

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let oldElapsedTime = 0;
const clock = new THREE.Clock();
// 动画
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // 应用风力 (从右往左吹)
  if (parameters.applyWind) {
    const windDirection = new CANNON.Vec3(-parameters.windForce, 0, 0);
    sphereBody.applyForce(windDirection, sphereBody.position);
  }

  // update physics world
  world.step(1 / 60, deltaTime, 3);
  sphereMesh.position.copy(sphereBody.position);
  orbitControls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};
animate();

// 自适应
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
