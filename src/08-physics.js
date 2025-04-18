// import * as THREE from "three";
import "./assets/style/style.css";
import "./assets/style/physics.css";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import GrassColorTexture from "./assets/texture/grasslight-big.jpg";
// import DropEffect from "./assets/audio/drop.mp3";
// import RollEffect from "./assets/audio/roll.mp3";
// import CANNON from "cannon";
import WindIcon from "./assets/svg/wind.svg";
import WindAnimatedIcon from "./assets/svg/wind-animated.svg";
import NorthIcon from "./assets/svg/north.svg";
import NorthEastIcon from "./assets/svg/northeast.svg";
import EastIcon from "./assets/svg/east.svg";
import SouthEastIcon from "./assets/svg/southeast.svg";
import SouthIcon from "./assets/svg/south.svg";
import SouthWestIcon from "./assets/svg/southwest.svg";
import WestIcon from "./assets/svg/west.svg";
import NorthWestIcon from "./assets/svg/northwest.svg";

let isStartGame = false;
let currentDirection = "North";
let currentWindForce = 2;

const startGame = () => {
  isStartGame = true;
  // 移除开始按钮
  const startButton = document.getElementById("start-button");
  if (!startButton) return;
  startButton.classList.add("fade-out");
  setTimeout(() => {
    if (startButton.parentNode) {
      startButton.parentNode.removeChild(startButton);
    }
  }, 500);
  createWindWheel();
  createWindForceIndicator();
};

// 创建开始按钮
const createStartButton = () => {
  // 创建按钮
  const startButton = document.createElement("button");
  startButton.id = "start-button";
  startButton.textContent = "开始体验";
  startButton.addEventListener("click", startGame);
  document.body.appendChild(startButton);
};

// 创建风力指示器
const createWindForceIndicator = () => {
  const windForceIndicator = document.createElement("div");
  windForceIndicator.id = "wind-force-indicator";
  windForceIndicator.classList.add("fade-in");

  // 添加标题
  const title = document.createElement("h3");
  title.className = "wind-title";
  title.textContent = "风力";
  windForceIndicator.appendChild(title);

  // 创建风力级别容器
  const forceLevelsContainer = document.createElement("div");
  forceLevelsContainer.className = "force-levels-container";

  // 创建四个风力级别
  [0, 1, 2, 3].forEach((force) => {
    const forceLevel = document.createElement("div");
    forceLevel.className = `force-level ${
      currentWindForce === force ? "active" : "inactive"
    }`;
    forceLevel.setAttribute("data-force", force);

    // 添加风图标 (使用img标签加载SVG)
    const windImg = document.createElement("img");
    if (currentWindForce === force && force > 0) {
      windImg.src = WindAnimatedIcon;
    } else {
      windImg.src = WindIcon;
    }
    forceLevel.appendChild(windImg);

    // 添加级别数字
    const forceNumber = document.createElement("div");
    forceNumber.className = "force-number";
    forceNumber.textContent = force;
    forceLevel.appendChild(forceNumber);
    forceLevelsContainer.appendChild(forceLevel);
  });
  windForceIndicator.appendChild(forceLevelsContainer);
  document.body.appendChild(windForceIndicator);
};

// 创建风力盘
const createWindWheel = () => {
  const windWheel = document.createElement("div");
  windWheel.id = "wind-wheel";
  windWheel.classList.add("fade-in");

  // 添加标题
  const title = document.createElement("h3");
  title.className = "wind-title";
  title.textContent = "风向";
  windWheel.appendChild(title);

  // 创建罗盘容器
  const compass = document.createElement("div");
  compass.className = "wind-compass";

  // 定义所有方向及其对应的SVG图标
  const directions = [
    {
      name: "North",
      className: "north",
      icon: NorthIcon,
    },
    {
      name: "Northeast",
      className: "northeast",
      icon: NorthEastIcon,
    },
    {
      name: "East",
      className: "east",
      icon: EastIcon,
    },
    {
      name: "Southeast",
      className: "southeast",
      icon: SouthEastIcon,
    },
    {
      name: "South",
      className: "south",
      icon: SouthIcon,
    },
    {
      name: "Southwest",
      className: "southwest",
      icon: SouthWestIcon,
    },
    {
      name: "West",
      className: "west",
      icon: WestIcon,
    },
    {
      name: "Northwest",
      className: "northwest",
      icon: NorthWestIcon,
    },
  ];

  // 创建所有方向的箭头
  directions.forEach((dir) => {
    const dirElement = document.createElement("div");
    dirElement.className = `wind-direction ${dir.className} ${
      currentDirection === dir.name ? "active" : "inactive"
    }`;

    // 使用img元素加载SVG图标
    const dirImg = document.createElement("img");
    dirImg.src = dir.icon;
    dirElement.appendChild(dirImg);

    compass.appendChild(dirElement);
  });

  // 添加中心圆圈
  const centerCircle = document.createElement("div");
  centerCircle.className = "wind-center";
  compass.appendChild(centerCircle);

  windWheel.appendChild(compass);
  document.body.appendChild(windWheel);
};

createStartButton();

// // 添加模拟控制变量
// let isSimulationRunning = false;

// // 添加音频
// const dropSound = new Audio(DropEffect);
// const rollSound = new Audio(RollEffect);
// rollSound.loop = true;
// rollSound.volume = 0; // 初始音量为0
// let maxImpactVelocity;
// let isRollSoundPlaying = false; // 追踪滚动声音是否正在播放

// const playDropSound = (collision) => {
//   // 检查碰撞强度，只在有效碰撞时播放声音
//   const impactVelocity = collision.contact.getImpactVelocityAlongNormal();
//   if (!maxImpactVelocity) {
//     maxImpactVelocity = impactVelocity;
//   }

//   // 只有当碰撞强度足够大时才尝试播放声音
//   if (Math.abs(impactVelocity) > 1.5) {
//     dropSound.volume = impactVelocity / maxImpactVelocity;
//     // 重置音频时间
//     dropSound.currentTime = 0.9;
//     dropSound.play();
//   }
// };

// // 处理滚动声音函数
// const updateRollSound = (velocity) => {
//   const speed = velocity.length();

//   // 如果速度足够大且风力开启，播放滚动声音
//   if (speed > 0.5 && parameters.applyWind) {
//     // 根据速度调整音量
//     rollSound.volume = Math.min(speed / 10, 1);

//     // 如果声音未播放，开始播放
//     if (!isRollSoundPlaying) {
//       rollSound.play();
//       isRollSoundPlaying = true;
//     }
//   } else {
//     // 速度太小或风力关闭，停止声音
//     if (isRollSoundPlaying) {
//       rollSound.pause();
//       rollSound.currentTime = 0;
//       isRollSoundPlaying = false;
//     }
//   }
// };

// // 场景
// const scene = new THREE.Scene();

// // 物理场景
// const world = new CANNON.World();
// world.broadphase = new CANNON.SAPBroadphase(world);
// world.allowSleep = true;
// // 设置重力
// world.gravity.set(0, -9.82, 0);

// // 环境光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// // 平行光源（用于产生阴影）
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(2, 2, 1);
// directionalLight.castShadow = true;
// // 设置阴影贴图分辨率
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// scene.add(directionalLight);

// // 加载草地纹理
// const textureLoader = new THREE.TextureLoader();
// const grassTexture = textureLoader.load(GrassColorTexture);
// grassTexture.wrapS = THREE.RepeatWrapping;
// grassTexture.wrapT = THREE.RepeatWrapping;
// grassTexture.repeat.set(5, 5);

// // 相机
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );
// camera.position.set(0, 8, 5);
// camera.lookAt(0, 0, 0);
// scene.add(camera);

// const canvas = document.querySelector(".webgl");

// // 轨道控制器
// const orbitControls = new OrbitControls(camera, canvas);

// // 构建球体
// const createShpere = (radius, color) => {
//   // 球体高度
//   const height = 5;
//   // 场景球体
//   const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
//   const sphereMaterial = new THREE.MeshPhysicalMaterial({
//     color,
//     metalness: 0.1,
//     roughness: 0,
//     transmission: 0.9, // 透明度
//     ior: 1.5, // 折射率 (玻璃约为1.5)
//     thickness: 1, // 厚度
//     clearcoat: 1.0,
//     clearcoatRoughness: 0.1,
//   });
//   const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   sphereMesh.castShadow = true;
//   sphereMesh.position.set(0, height, 0);
//   // 物理球体
//   const sphereShape = new CANNON.Sphere(radius);
//   const sphereBody = new CANNON.Body({
//     mass: 1,
//     shape: sphereShape,
//     position: new CANNON.Vec3(0, height, 0),
//     linearDamping: 0.5,
//   });
//   // 添加碰撞事件监听器，但只在与地面碰撞时播放声音
//   sphereBody.addEventListener("collide", (collision) => {
//     // 获取碰撞对象的材质
//     const collidedBody = collision.body;
//     // 只有当碰撞对象是地面（planePhysicsMaterial）时才播放声音
//     if (collidedBody.material === planePhysicsMaterial) {
//       playDropSound(collision);
//     }
//   });
//   world.addBody(sphereBody);
//   return { sphereMesh, sphereBody };
// };
// const planeWidth = 10;
// const planeHeight = 10;
// // 构建平面
// const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
// const planeMaterial = new THREE.MeshStandardMaterial({
//   map: grassTexture,
// });

// // physics material
// const spherePhysicsMaterial = new CANNON.Material("sphere");
// const planePhysicsMaterial = new CANNON.Material("plane");
// const jellyPhysicsMaterial = new CANNON.Material("jelly");

// const createPlane = () => {
//   const quaternion = -Math.PI / 2;
//   // 场景平面
//   const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
//   planeMesh.rotation.set(quaternion, 0, 0);
//   planeMesh.receiveShadow = true;
//   // 物理平面
//   const planeShape = new CANNON.Plane();
//   const planeBody = new CANNON.Body({
//     mass: 0,
//     shape: planeShape,
//   });
//   planeBody.quaternion.setFromEuler(quaternion, 0, 0);

//   // 添加空气墙
//   const wallsConfig = [
//     // 左墙
//     {
//       position: new CANNON.Vec3(-planeWidth / 2, planeHeight / 2, 0),
//       rotation: [0, quaternion * 3, 0],
//     },
//     // 右墙
//     {
//       position: new CANNON.Vec3(planeWidth / 2, planeHeight / 2, 0),
//       rotation: [0, quaternion, 0],
//     },
//     // 前墙
//     {
//       position: new CANNON.Vec3(0, planeHeight / 2, planeWidth / 2),
//       rotation: [quaternion * 2, 0, 0],
//     },
//     // 后墙
//     {
//       position: new CANNON.Vec3(0, planeHeight / 2, -planeWidth / 2),
//       rotation: [0, 0, 0],
//     },
//   ];

//   // 创建并添加所有墙
//   wallsConfig.forEach((config) => {
//     const wallBody = new CANNON.Body({
//       mass: 0,
//       shape: planeShape,
//       position: config.position,
//       material: jellyPhysicsMaterial,
//     });
//     wallBody.quaternion.setFromEuler(...config.rotation);
//     world.addBody(wallBody);
//   });

//   world.addBody(planeBody);
//   return { planeMesh, planeBody };
// };

// // 球
// const { sphereMesh, sphereBody } = createShpere(0.3, 0xffffff);
// const { planeMesh, planeBody } = createPlane();

// scene.add(sphereMesh, planeMesh);

// // 设置小球和地面中间的弹撞系数
// const contactMaterial = new CANNON.ContactMaterial(
//   spherePhysicsMaterial,
//   planePhysicsMaterial,
//   {
//     restitution: 0.6, //弹性系数
//     friction: 0.4, //摩擦系数
//   }
// );
// world.addContactMaterial(contactMaterial);

// // 设置小球和空气墙之间的高弹性碰撞
// const jellyContactMaterial = new CANNON.ContactMaterial(
//   spherePhysicsMaterial,
//   jellyPhysicsMaterial,
//   {
//     restitution: 0.8, // 高弹性系数
//     friction: 0.1, // 低摩擦系数
//   }
// );
// world.addContactMaterial(jellyContactMaterial);

// // 小球和地面中间的弹撞系数
// sphereBody.material = spherePhysicsMaterial;
// planeBody.material = planePhysicsMaterial;

// // 渲染器
// const renderer = new THREE.WebGLRenderer({
//   canvas,
//   antialias: true,
// });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(fogColor);
// // 开启阴影
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// // 在DOM加载完成后创建按钮
// window.addEventListener("DOMContentLoaded", createStartButton);

// let oldElapsedTime = 0;
// const clock = new THREE.Clock();
// // 动画
// const animate = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - oldElapsedTime;
//   oldElapsedTime = elapsedTime;

//   if (isSimulationRunning) {
//     if (parameters.applyWind && sphereBody) {
//       let windX = 0;
//       let windZ = 0;

//       // 根据选择的风向设置风力方向
//       switch (parameters.windDirection) {
//         case "东": // 从东向西吹
//           windX = -parameters.windForce;
//           break;
//         case "南": // 从南向北吹
//           windZ = -parameters.windForce;
//           break;
//         case "西": // 从西向东吹
//           windX = parameters.windForce;
//           break;
//         case "北": // 从北向南吹
//           windZ = parameters.windForce;
//           break;
//         case "东北": // 从东北向西南吹
//           windX = -parameters.windForce * 0.7071; // 根号2的一半，保持合力大小一致
//           windZ = parameters.windForce * 0.7071;
//           break;
//         case "西北": // 从西北向东南吹
//           windX = parameters.windForce * 0.7071;
//           windZ = parameters.windForce * 0.7071;
//           break;
//         case "东南": // 从东南向西北吹
//           windX = -parameters.windForce * 0.7071;
//           windZ = -parameters.windForce * 0.7071;
//           break;
//         case "西南": // 从西南向东北吹
//           windX = parameters.windForce * 0.7071;
//           windZ = -parameters.windForce * 0.7071;
//           break;
//       }
//       const windDirection = new CANNON.Vec3(windX, 0, windZ);
//       sphereBody.applyForce(windDirection, sphereBody.position);
//     }

//     // update physics world
//     world.step(1 / 60, deltaTime, 3);

//     // 更新滚动声音
//     updateRollSound(sphereBody.velocity);
//   } else {
//     // 如果模拟未运行，确保声音停止
//     if (isRollSoundPlaying) {
//       rollSound.pause();
//       rollSound.currentTime = 0;
//       isRollSoundPlaying = false;
//     }
//   }
//   // 更新视觉模型位置
//   sphereMesh.position.copy(sphereBody.position);
//   orbitControls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(animate);
// };
// animate();

// // 自适应
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });
