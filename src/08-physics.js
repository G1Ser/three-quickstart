import * as THREE from "three";
import CANNON from "cannon";
import "./assets/style/style.css";
import "./assets/style/physics.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GrassColorTexture from "./assets/texture/grasslight-big.jpg";
import DropEffect from "./assets/audio/drop.mp3";
import RollEffect from "./assets/audio/roll.mp3";
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

/**
 * 物理世界类 - 负责物理引擎和物体碰撞
 */
class PhysicsWorld {
  constructor(config) {
    this.config = config;
    this.world = null;
    this.sphereBody = null;
    this.planeBody = null;
    this.spherePhysicsMaterial = null;
    this.planePhysicsMaterial = null;
    this.jellyPhysicsMaterial = null;
    this.maxImpactVelocity = null;
    this.isBallLanded = false;
    this.onBallLanded = null;
    this.dropSound = new Audio(DropEffect);
    this.rollSound = new Audio(RollEffect);
    
    this.init();
  }

  init() {
    // 物理世界
    this.world = new CANNON.World();
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.gravity.set(0, -9.82, 0);

    // 物理材质
    this.spherePhysicsMaterial = new CANNON.Material("sphere");
    this.planePhysicsMaterial = new CANNON.Material("plane");
    this.jellyPhysicsMaterial = new CANNON.Material("jelly");

    // 创建物理对象
    this.createPhysicsObjects();

    // 设置材质碰撞参数
    this.setupContactMaterials();
  }

  createPhysicsObjects() {
    const { sphereRadius, sphereHeight, planeQuaternion, wallsConfig } = this.config;
    
    // 创建球体
    const sphereShape = new CANNON.Sphere(sphereRadius);
    this.sphereBody = new CANNON.Body({
      mass: 1,
      shape: sphereShape,
      position: new CANNON.Vec3(0, sphereHeight, 0),
      linearDamping: 0.5,
      material: this.spherePhysicsMaterial,
    });

    // 添加碰撞事件监听器
    this.sphereBody.addEventListener("collide", (collision) => {
      const collidedBody = collision.body;
      const velocity = collision.contact.getImpactVelocityAlongNormal();
      if (collidedBody.material === this.planePhysicsMaterial) {
        this.playDropSound(velocity);
      }
      if (velocity < 0.1 && !this.isBallLanded) {
        this.isBallLanded = true;
        if (this.onBallLanded) {
          this.onBallLanded();
        }
      }
    });
    this.world.addBody(this.sphereBody);

    // 创建平面
    const planeShape = new CANNON.Plane();
    this.planeBody = new CANNON.Body({
      mass: 0,
      shape: planeShape,
      material: this.planePhysicsMaterial,
    });
    this.planeBody.quaternion.setFromEuler(planeQuaternion, 0, 0);
    this.world.addBody(this.planeBody);

    // 创建并添加所有墙
    wallsConfig.forEach((config) => {
      const wallBody = new CANNON.Body({
        mass: 0,
        shape: planeShape,
        position: new CANNON.Vec3(...config.position),
        material: this.jellyPhysicsMaterial,
      });
      wallBody.quaternion.setFromEuler(...config.rotation);
      this.world.addBody(wallBody);
    });
  }

  setupContactMaterials() {
    // 设置小球和地面之间的弹撞系数
    const contactMaterial = new CANNON.ContactMaterial(
      this.spherePhysicsMaterial,
      this.planePhysicsMaterial,
      {
        restitution: 0.6, // 弹性系数
        friction: 0.4, // 摩擦系数
      }
    );
    this.world.addContactMaterial(contactMaterial);

    // 设置小球和空气墙之间的高弹性碰撞
    const jellyContactMaterial = new CANNON.ContactMaterial(
      this.spherePhysicsMaterial,
      this.jellyPhysicsMaterial,
      {
        restitution: 0.8, // 高弹性系数
        friction: 0.1, // 低摩擦系数
      }
    );
    this.world.addContactMaterial(jellyContactMaterial);
  }

  // 播放碰撞音效
  playDropSound(velocity) {
    if (!this.maxImpactVelocity) {
      this.maxImpactVelocity = velocity;
    }

    if (velocity > 1.5) {
      this.dropSound.volume = velocity / this.maxImpactVelocity;
      this.dropSound.currentTime = 0.9;
      this.dropSound.play();
    }
  }

  // 播放滚动音效
  playRollSound(windForce) {
    // 如果球未落地或未开始应用风力，不播放
    if (!this.sphereBody || !this.isBallLanded || windForce === 0) {
      // 如果之前在播放，逐渐停止
      if (!this.rollSound.paused) {
        this.rollSound.volume = Math.max(0, this.rollSound.volume - 0.03);
        if (this.rollSound.volume <= 0.05) {
          this.rollSound.pause();
          this.rollSound.currentTime = 0;
        }
      }
      return;
    }

    // 获取球体水平速度（忽略垂直方向）
    const velocity = this.sphereBody.velocity.length();

    // 如果速度足够大，播放滚动音效
    if (velocity > 0.3) {
      // 如果未播放，开始播放
      if (this.rollSound.paused) {
        this.rollSound.currentTime = 0;
        this.rollSound.loop = true;
        this.rollSound.volume = 0;
        this.rollSound.play();
      }

      // 基于速度调整音量，实现淡入效果
      const targetVolume = Math.min(0.7, velocity / 10);
      // 平滑过渡到目标音量
      this.rollSound.volume = this.rollSound.volume * 0.95 + targetVolume * 0.05;
    } else if (!this.rollSound.paused) {
      // 速度不足，实现淡出效果
      this.rollSound.volume = Math.max(0, this.rollSound.volume - 0.03);
      if (this.rollSound.volume <= 0.05) {
        this.rollSound.pause();
        this.rollSound.currentTime = 0;
      }
    }
  }

  update(deltaTime) {
    this.world.step(1 / 60, deltaTime);
  }

  applyWindForce(direction, force) {
    if (!this.sphereBody || !this.isBallLanded) return;

    let forceX = 0;
    let forceZ = 0;
    const diagonalFactor = Math.sqrt(2) / 2; // 对角线方向的力度系数

    // 根据方向确定力的方向
    switch (direction) {
      case "North":
        forceZ = -force;
        break;
      case "Northeast":
        forceX = force * diagonalFactor;
        forceZ = -force * diagonalFactor;
        break;
      case "East":
        forceX = force;
        break;
      case "Southeast":
        forceX = force * diagonalFactor;
        forceZ = force * diagonalFactor;
        break;
      case "South":
        forceZ = force;
        break;
      case "Southwest":
        forceX = -force * diagonalFactor;
        forceZ = force * diagonalFactor;
        break;
      case "West":
        forceX = -force;
        break;
      case "Northwest":
        forceX = -force * diagonalFactor;
        forceZ = -force * diagonalFactor;
        break;
    }

    // 应用力到球体
    this.sphereBody.applyForce(
      new CANNON.Vec3(forceX, 0, forceZ),
      this.sphereBody.position
    );
  }
}

/**
 * Three.js 场景类 - 负责3D渲染和相机控制
 */
class Scene {
  constructor(canvas, config, physicsWorld) {
    this.canvas = canvas;
    this.config = config;
    this.physicsWorld = physicsWorld;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.orbitControls = null;
    this.sphereMesh = null;
    this.planeMesh = null;
    
    this.init();
  }

  init() {
    // 创建场景
    this.scene = new THREE.Scene();

    // 添加蓝天背景
    const skyColor = 0xd1edfe; // 浅蓝色
    this.scene.background = new THREE.Color(skyColor);

    // 设置光照
    this.setupLights();

    // 设置相机
    this.setupCamera();

    // 创建可视化物体
    this.createVisualObjects();

    // 设置渲染器
    this.setupRenderer();

    // 添加窗口调整事件
    this.setupEventListeners();
  }

  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 平行光源（用于产生阴影）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0.5, 4);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    // 轨道控制器
    this.orbitControls = new OrbitControls(this.camera, this.canvas);

    // 添加控制器限制
    this.orbitControls.minDistance = 4;
    this.orbitControls.maxDistance = 10;
    this.orbitControls.minPolarAngle = Math.PI * 0.1;
    this.orbitControls.maxPolarAngle = Math.PI * 0.4;
    this.orbitControls.enableDamping = true;
  }

  createVisualObjects() {
    const { sphereRadius, planeWidth, planeHeight, planeQuaternion, wallsConfig } = this.config;
    
    // 球体
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0,
      transmission: 0.9,
      ior: 1.5,
      thickness: 1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphereMesh.castShadow = true;
    this.sphereMesh.position.copy(this.physicsWorld.sphereBody.position);
    this.scene.add(this.sphereMesh);

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
      this.scene.add(wallMesh);
    });
    this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.planeMesh.rotation.set(planeQuaternion, 0, 0);
    this.planeMesh.receiveShadow = true;
    this.scene.add(this.planeMesh);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 开启阴影
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  update() {
    // 更新视觉模型位置
    this.sphereMesh.position.copy(this.physicsWorld.sphereBody.position);
    this.sphereMesh.quaternion.copy(this.physicsWorld.sphereBody.quaternion);

    // 更新控制器
    this.orbitControls.update();

    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * UI类 - 负责界面元素管理
 */
class UI {
  constructor() {
    this.windIcons = {
      static: WindIcon,
      animated: WindAnimatedIcon,
      directions: {
        North: NorthIcon,
        Northeast: NorthEastIcon,
        East: EastIcon,
        Southeast: SouthEastIcon,
        South: SouthIcon,
        Southwest: SouthWestIcon,
        West: WestIcon,
        Northwest: NorthWestIcon
      }
    };
  }
  
  createStartButton(onStart) {
    const startButton = document.createElement("button");
    startButton.id = "start-button";
    startButton.textContent = "开始体验";
    startButton.addEventListener("click", () => {
      this.removeStartButton(startButton);
      onStart();
    });
    document.body.appendChild(startButton);
    return startButton;
  }
  
  removeStartButton(button) {
    button.classList.add("fade-out");
    setTimeout(() => {
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
    }, 500);
  }

  createWindForceIndicator(currentWindForce, windForces) {
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
      const forceValue = windForces[index];
      forceLevel.className = `force-level ${
        currentWindForce === forceValue ? "active" : "inactive"
      }`;
      forceLevel.setAttribute("data-force", index);

      // 添加风图标
      const windImg = document.createElement("img");
      if (currentWindForce === forceValue && forceValue > 0) {
        windImg.src = this.windIcons.animated;
      } else {
        windImg.src = this.windIcons.static;
      }
      forceLevel.appendChild(windImg);

      // 添加级别数字
      const forceNumber = document.createElement("div");
      forceNumber.className = "force-number";
      forceNumber.textContent = forceValue;
      forceLevel.appendChild(forceNumber);
      forceLevelsContainer.appendChild(forceLevel);
    });
    windForceIndicator.appendChild(forceLevelsContainer);
    document.body.appendChild(windForceIndicator);
    
    return windForceIndicator;
  }

  createWindWheel(currentDirection) {
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

    // 定义所有方向
    const directions = [
      { name: "North", className: "north" },
      { name: "Northeast", className: "northeast" },
      { name: "East", className: "east" },
      { name: "Southeast", className: "southeast" },
      { name: "South", className: "south" },
      { name: "Southwest", className: "southwest" },
      { name: "West", className: "west" },
      { name: "Northwest", className: "northwest" }
    ];

    // 创建所有方向的箭头
    directions.forEach((dir) => {
      const dirElement = document.createElement("div");
      dirElement.className = `wind-direction ${dir.className} ${
        currentDirection === dir.name ? "active" : "inactive"
      }`;

      // 使用img元素加载SVG图标
      const dirImg = document.createElement("img");
      dirImg.src = this.windIcons.directions[dir.name];
      dirElement.appendChild(dirImg);

      compass.appendChild(dirElement);
    });

    // 添加中心圆圈
    const centerCircle = document.createElement("div");
    centerCircle.className = "wind-center";
    compass.appendChild(centerCircle);

    windWheel.appendChild(compass);
    document.body.appendChild(windWheel);
    
    return windWheel;
  }

  updateWindUI(windWheel, windForceIndicator, currentDirection, currentWindForce, windForces) {
    if (!windWheel || !windForceIndicator) return;
    
    // 更新风向盘
    const directions = windWheel.querySelectorAll(".wind-direction");
    directions.forEach((dirElement) => {
      dirElement.classList.remove("active");
      dirElement.classList.add("inactive");

      // 获取当前方向类名
      const dirClassName = dirElement.className.split(" ")[1]; // 例如 "north"

      // 将当前选择的方向设为活跃
      const currentDirClass = currentDirection.toLowerCase().replace(/\s+/g, '');
      if (dirClassName === currentDirClass) {
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
      const forceIndex = windForces.indexOf(currentWindForce);

      // 如果当前等级与风力索引匹配，设为活跃
      if (index === forceIndex) {
        forceLevel.classList.remove("inactive");
        forceLevel.classList.add("active");

        // 更新风图标（动画）
        const windImg = forceLevel.querySelector("img");
        if (windImg && currentWindForce > 0) {
          windImg.src = this.windIcons.animated;
        } else if (windImg) {
          windImg.src = this.windIcons.static;
        }
      } else {
        // 更新风图标（静态）
        const windImg = forceLevel.querySelector("img");
        if (windImg) {
          windImg.src = this.windIcons.static;
        }
      }

      // 更新风力数字显示
      const forceNumber = forceLevel.querySelector(".force-number");
      if (forceNumber) {
        forceNumber.textContent = windForces[index];
      }
    });
  }
}

/**
 * 风力系统类 - 管理风向和风力
 */
class WindSystem {
  constructor(physicsWorld, ui) {
    this.physicsWorld = physicsWorld;
    this.ui = ui;
    this.windForces = [0, 3, 6, 9]; // 风力值定义
    this.directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]; // 风向定义
    this.currentDirection = "North"; // 初始风向
    this.currentWindForce = 3; // 初始风力
    this.lastWindChangeTime = 0;
    this.windWheel = null;
    this.windForceIndicator = null;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.windWheel = this.ui.createWindWheel(this.currentDirection);
    this.windForceIndicator = this.ui.createWindForceIndicator(this.currentWindForce, this.windForces);
    this.lastWindChangeTime = Date.now();
  }

  updateWindForceAndDirection() {
    // 随机选择一个风力值
    const randomForceIndex = Math.floor(Math.random() * this.windForces.length);
    const newForce = this.windForces[randomForceIndex];

    // 随机选择一个方向
    const randomDirectionIndex = Math.floor(Math.random() * this.directions.length);
    const newDirection = this.directions[randomDirectionIndex];

    // 更新当前风力和方向
    this.currentWindForce = newForce;
    this.currentDirection = newDirection;

    // 更新UI
    this.ui.updateWindUI(this.windWheel, this.windForceIndicator, this.currentDirection, this.currentWindForce, this.windForces);

    // 记录最后一次风力变化的时间
    this.lastWindChangeTime = Date.now();
  }

  update() {
    if (!this.isActive) return;
    
    // 检查是否需要变化风力 (每3-5秒)
    const now = Date.now();
    const timeSinceLastChange = now - this.lastWindChangeTime;
    const changeInterval = Math.random() * 2000 + 3000; // 3-5秒

    if (timeSinceLastChange > changeInterval) {
      this.updateWindForceAndDirection();
    }

    // 应用风力到球体
    this.physicsWorld.applyWindForce(this.currentDirection, this.currentWindForce);
    
    // 处理滚动音效
    this.physicsWorld.playRollSound(this.currentWindForce);
  }
}

/**
 * 游戏主类 - 管理整个应用
 */
class PhysicsGame {
  constructor() {
    // 创建canvas元素
    this.canvas = document.querySelector(".webgl");
    
    // 场景配置
    this.config = {
      sphereRadius: 0.3,
      sphereHeight: 5,
      planeWidth: 10,
      planeHeight: 10,
      planeQuaternion: -Math.PI / 2,
      wallsConfig: [
        // 左墙
        {
          position: [-5, 1, 0],
          rotation: [0, -Math.PI / 2 * 3, 0],
        },
        // 右墙
        {
          position: [5, 1, 0],
          rotation: [0, -Math.PI / 2, 0],
        },
        // 前墙
        {
          position: [0, 1, 5],
          rotation: [-Math.PI / 2 * 2, 0, 0],
        },
        // 后墙
        {
          position: [0, 1, -5],
          rotation: [0, 0, 0],
        },
      ]
    };
    
    // 初始化组件
    this.ui = new UI();
    this.physicsWorld = new PhysicsWorld(this.config);
    this.scene = new Scene(this.canvas, this.config, this.physicsWorld);
    this.windSystem = new WindSystem(this.physicsWorld, this.ui);
    
    // 游戏状态
    this.isInitialized = false;
    this.clock = new THREE.Clock();
    this.oldElapsedTime = 0;
    
    // 配置事件处理
    this.physicsWorld.onBallLanded = () => this.onBallLanded();
    
    // 创建开始按钮
    this.ui.createStartButton(() => this.startGame());
  }
  
  onBallLanded() {
    this.windSystem.activate();
  }
  
  startGame() {
    if (!this.isInitialized) {
      this.animate();
      this.isInitialized = true;
    }
  }
  
  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    // 更新物理世界
    this.physicsWorld.update(deltaTime);
    
    // 处理风力变化
    this.windSystem.update();
    
    // 更新视觉场景
    this.scene.update();

    // 请求下一帧
    window.requestAnimationFrame(() => this.animate());
  }
}

// 在DOM加载完成后启动游戏
window.addEventListener("DOMContentLoaded", () => {
  new PhysicsGame();
});
