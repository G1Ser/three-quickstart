import * as THREE from "three";
import CANNON from "cannon";
import "./assets/style/style.css";
import "./assets/style/physics.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GrassColorTexture from "./assets/texture/grasslight-big.jpg";
import DropEffect from "./assets/audio/drop.mp3";
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
import * as dat from "dat.gui";
const gui = new dat.GUI();
gui.domElement.style.position = "absolute";
gui.domElement.style.left = "0";

const parameters = {
  applyWind: false,
};
gui.add(parameters, "applyWind");

// 风力值定义（0, 3, 6, 9）
const WIND_FORCES = [0, 3, 6, 9];
// 主要风向定义
const MAIN_DIRECTIONS = ["North", "East", "South", "West"];

let currentDirection = "North";
let currentWindForce = 2;
let windChangeInterval = null;
let lastWindChangeTime = 0;

// DOM元素
const canvas = document.querySelector(".webgl");

// 物理世界设置
let world;
let sphereBody;
let planeBody;

// 物理材质
let spherePhysicsMaterial;
let planePhysicsMaterial;
let jellyPhysicsMaterial;

// Three.js场景元素
let scene;
let camera;
let renderer;
let orbitControls;
let sphereMesh;
let planeMesh;

// 场景属性
const sphereRadius = 0.3;
const sphereHeight = 5;
const planeWidth = 10;
const planeHeight = 10;
const planeQuaternion = -Math.PI / 2;
const wallsConfig = [
  // 左墙
  {
    position: [-planeWidth / 2, planeHeight / 10, 0],
    rotation: [0, planeQuaternion * 3, 0],
  },
  // 右墙
  {
    position: [planeWidth / 2, planeHeight / 10, 0],
    rotation: [0, planeQuaternion, 0],
  },
  // 前墙
  {
    position: [0, planeHeight / 10, planeWidth / 2],
    rotation: [planeQuaternion * 2, 0, 0],
  },
  // 后墙
  {
    position: [0, planeHeight / 10, -planeWidth / 2],
    rotation: [0, 0, 0],
  },
];
// 音频设置
const dropSound = new Audio(DropEffect);
let maxImpactVelocity;

// 初始化标志
let isInitialized = false;
// 球落地标志
let isBallLanded = false;

// 游戏启动函数
const startGame = () => {
  // 移除开始按钮
  const startButton = document.getElementById("start-button");
  if (!startButton) return;
  startButton.classList.add("fade-out");
  setTimeout(() => {
    if (startButton.parentNode) {
      startButton.parentNode.removeChild(startButton);
    }
  }, 500);

  // 初始化物理场景
  if (!isInitialized) {
    initPhysics();
    initScene();
    animate();
    isInitialized = true;
  }
};

// 创建开始按钮
const createStartButton = () => {
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
  [0, 1, 2, 3].forEach((index) => {
    const forceLevel = document.createElement("div");
    const forceValue = WIND_FORCES[index]; // 获取实际风力值
    forceLevel.className = `force-level ${
      currentWindForce === forceValue ? "active" : "inactive"
    }`;
    forceLevel.setAttribute("data-force", index);

    // 添加风图标 (使用img标签加载SVG)
    const windImg = document.createElement("img");
    if (currentWindForce === forceValue && forceValue > 0) {
      windImg.src = WindAnimatedIcon;
    } else {
      windImg.src = WindIcon;
    }
    forceLevel.appendChild(windImg);

    // 添加级别数字
    const forceNumber = document.createElement("div");
    forceNumber.className = "force-number";
    forceNumber.textContent = forceValue; // 显示实际风力值
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

// 播放碰撞音效
const playDropSound = (velocity) => {
  if (!maxImpactVelocity) {
    maxImpactVelocity = velocity;
  }

  if (velocity > 1.5) {
    dropSound.volume = velocity / maxImpactVelocity;
    dropSound.currentTime = 0.9;
    dropSound.play();
  }
};

// 初始化物理世界
const initPhysics = () => {
  // 物理世界
  world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(0, -9.82, 0);

  // 物理材质
  spherePhysicsMaterial = new CANNON.Material("sphere");
  planePhysicsMaterial = new CANNON.Material("plane");
  jellyPhysicsMaterial = new CANNON.Material("jelly");

  // 创建物理对象
  createPhysicsObjects();

  // 设置材质碰撞参数
  setupContactMaterials();
};

// 创建物理对象
const createPhysicsObjects = () => {
  // 创建球体
  const sphereShape = new CANNON.Sphere(sphereRadius);
  sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
    position: new CANNON.Vec3(0, sphereHeight, 0),
    linearDamping: 0.5,
    material: spherePhysicsMaterial,
  });

  // 添加碰撞事件监听器
  sphereBody.addEventListener("collide", (collision) => {
    const collidedBody = collision.body;
    const velocity = collision.contact.getImpactVelocityAlongNormal();
    if (collidedBody.material === planePhysicsMaterial) {
      playDropSound(velocity);
    }
    if (velocity < 0.1) {
      // 创建风力UI元素
      createWindWheel();
      createWindForceIndicator();
      isBallLanded = true;

      // 设置初始风力和方向
      updateWindForceAndDirection();

      // 启动3-5秒后变化风力的计时
      lastWindChangeTime = Date.now();
    }
  });
  world.addBody(sphereBody);

  // 创建平面
  const planeShape = new CANNON.Plane();
  planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape,
    material: planePhysicsMaterial,
  });
  planeBody.quaternion.setFromEuler(planeQuaternion, 0, 0);
  world.addBody(planeBody);

  // 添加空气墙

  // 创建并添加所有墙
  wallsConfig.forEach((config) => {
    const wallBody = new CANNON.Body({
      mass: 0,
      shape: planeShape,
      position: new CANNON.Vec3(...config.position),
      material: jellyPhysicsMaterial,
    });
    wallBody.quaternion.setFromEuler(...config.rotation);
    world.addBody(wallBody);
  });
};

// 设置接触材质
const setupContactMaterials = () => {
  // 设置小球和地面之间的弹撞系数
  const contactMaterial = new CANNON.ContactMaterial(
    spherePhysicsMaterial,
    planePhysicsMaterial,
    {
      restitution: 0.6, // 弹性系数
      friction: 0.4, // 摩擦系数
    }
  );
  world.addContactMaterial(contactMaterial);

  // 设置小球和空气墙之间的高弹性碰撞
  const jellyContactMaterial = new CANNON.ContactMaterial(
    spherePhysicsMaterial,
    jellyPhysicsMaterial,
    {
      restitution: 0.8, // 高弹性系数
      friction: 0.1, // 低摩擦系数
    }
  );
  world.addContactMaterial(jellyContactMaterial);
};

// 初始化Three.js场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene();

  // 添加蓝天背景
  const skyColor = 0xd1edfe; // 浅蓝色
  scene.background = new THREE.Color(skyColor);

  // 设置光照
  setupLights();

  // 设置相机
  setupCamera();

  // 创建可视化物体
  createVisualObjects();

  // 设置渲染器
  setupRenderer();

  // 添加窗口调整事件
  setupEventListeners();
};

// 设置光照
const setupLights = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 平行光源（用于产生阴影）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 2, 1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
};

// 设置相机
const setupCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.5, 4);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // 轨道控制器
  orbitControls = new OrbitControls(camera, canvas);

  // 添加控制器限制
  // 限制相机的最小距离，防止放大过度
  orbitControls.minDistance = 4;
  // 限制相机的最大距离，保持z=4的视角范围
  orbitControls.maxDistance = 10;
  // 限制垂直旋转角度，防止看到地板背面
  orbitControls.minPolarAngle = Math.PI * 0.1; // 防止往上看太多
  orbitControls.maxPolarAngle = Math.PI * 0.4; // 防止往下看太多
  // 启用阻尼效果使控制更平滑
  orbitControls.enableDamping = true;
};

// 创建可视化物体
const createVisualObjects = () => {
  // 球体
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0,
    transmission: 0.9, // 透明度
    ior: 1.5, // 折射率 (玻璃约为1.5)
    thickness: 1, // 厚度
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.castShadow = true;
  sphereMesh.position.copy(sphereBody.position);
  scene.add(sphereMesh);

  // 平面
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

  // 加载草地纹理
  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load(GrassColorTexture);
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(5, 5);

  const planeMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
  });
  const wallGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight / 5);
  // 空气墙材质
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  wallsConfig.forEach((config) => {
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(...config.position);
    wallMesh.rotation.set(...config.rotation);
    scene.add(wallMesh);
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.set(planeQuaternion, 0, 0);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
};

// 设置渲染器
const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启阴影
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// 设置事件监听器
const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

// 动画循环
let oldElapsedTime = 0;
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // 更新物理世界
  world.step(1 / 60, deltaTime);

  // 处理风力变化
  if (isBallLanded) {
    // 检查是否需要变化风力 (每3-5秒)
    const now = Date.now();
    const timeSinceLastChange = now - lastWindChangeTime;
    const changeInterval = Math.random() * 2000 + 3000; // 3-5秒

    if (timeSinceLastChange > changeInterval) {
      updateWindForceAndDirection(); // 这会更新lastWindChangeTime
    }

    // 应用风力到球体
    applyWindForce();
  }

  // 更新视觉模型位置
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  // 更新控制器
  orbitControls.update();

  // 渲染场景
  renderer.render(scene, camera);

  // 请求下一帧
  window.requestAnimationFrame(animate);
};

// 在DOM加载完成后创建按钮
window.addEventListener("DOMContentLoaded", createStartButton);

// 随机更新风力和方向
const updateWindForceAndDirection = () => {
  // 随机选择一个风力值
  const randomForceIndex = Math.floor(Math.random() * WIND_FORCES.length);
  const newForce = WIND_FORCES[randomForceIndex];

  // 随机选择一个方向
  const randomDirectionIndex = Math.floor(
    Math.random() * MAIN_DIRECTIONS.length
  );
  const newDirection = MAIN_DIRECTIONS[randomDirectionIndex];

  // 更新当前风力和方向
  currentWindForce = newForce;
  currentDirection = newDirection;

  // 更新UI
  updateWindUI();

  // 记录最后一次风力变化的时间
  lastWindChangeTime = Date.now();
};

// 更新风力UI显示
const updateWindUI = () => {
  // 如果UI元素已经创建
  const windWheel = document.getElementById("wind-wheel");
  const windForceIndicator = document.getElementById("wind-force-indicator");

  if (windWheel && windForceIndicator) {
    // 更新风向盘
    const directions = windWheel.querySelectorAll(".wind-direction");
    directions.forEach((dirElement) => {
      dirElement.classList.remove("active");
      dirElement.classList.add("inactive");

      // 获取当前方向类名
      const dirClassName = dirElement.className.split(" ")[1]; // 例如 "north"

      // 将当前选择的方向设为活跃
      if (dirClassName.toLowerCase() === currentDirection.toLowerCase()) {
        dirElement.classList.remove("inactive");
        dirElement.classList.add("active");
      }
    });

    // 更新风力指示器
    const forceLevels = windForceIndicator.querySelectorAll(".force-level");
    forceLevels.forEach((forceLevel, index) => {
      forceLevel.classList.remove("active");
      forceLevel.classList.add("inactive");

      // 找到与当前风力匹配的力值索引
      const forceIndex = WIND_FORCES.indexOf(currentWindForce);

      // 如果当前等级与风力索引匹配，设为活跃
      if (index === forceIndex) {
        forceLevel.classList.remove("inactive");
        forceLevel.classList.add("active");

        // 更新风图标（动画）
        const windImg = forceLevel.querySelector("img");
        if (windImg && currentWindForce > 0) {
          windImg.src = WindAnimatedIcon;
        } else if (windImg) {
          windImg.src = WindIcon;
        }
      } else {
        // 更新风图标（静态）
        const windImg = forceLevel.querySelector("img");
        if (windImg) {
          windImg.src = WindIcon;
        }
      }

      // 更新风力数字显示
      const forceNumber = forceLevel.querySelector(".force-number");
      if (forceNumber) {
        forceNumber.textContent = WIND_FORCES[index];
      }
    });
  }
};

// 应用风力到球体
const applyWindForce = () => {
  if (!sphereBody || !isBallLanded) return;

  let forceX = 0;
  let forceZ = 0;

  // 根据方向确定力的方向
  switch (currentDirection) {
    case "North":
      forceZ = -currentWindForce;
      break;
    case "East":
      forceX = currentWindForce;
      break;
    case "South":
      forceZ = currentWindForce;
      break;
    case "West":
      forceX = -currentWindForce;
      break;
  }

  console.log(forceX, forceZ);

  // 应用力到球体
  sphereBody.applyForce(
    new CANNON.Vec3(forceX, 0, forceZ),
    sphereBody.position
  );
};
