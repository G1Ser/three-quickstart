import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 纹理管理器
class TextureManager {
  constructor() {
    this.loader = new THREE.TextureLoader();
    this.textures = {};
  }

  load(name, path, options = {}) {
    const texture = this.loader.load(path);

    if (options.repeat) {
      texture.repeat.set(options.repeat[0], options.repeat[1]);
    }

    if (options.wrap) {
      texture.wrapS = options.wrap;
      texture.wrapT = options.wrap;
    }

    this.textures[name] = texture;
    return texture;
  }

  get(name) {
    return this.textures[name];
  }
}

// 场景配置器
class SceneConfigurator {
  static setupLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.1);
    const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.3);
    const doorLight = new THREE.PointLight(0xff7d46, 1, 10, 2);

    moonLight.position.set(10, 5, -5);
    doorLight.position.set(0, 2.5, 2.3);
    
    // 启用光源产生阴影
    moonLight.castShadow = true;
    doorLight.castShadow = true;
    
    // 优化月光的阴影
    moonLight.shadow.mapSize.width = 512;
    moonLight.shadow.mapSize.height = 512;
    moonLight.shadow.camera.far = 15;
    
    // 优化门灯的阴影
    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    scene.add(ambientLight, moonLight, doorLight);
    return { ambientLight, moonLight, doorLight };
  }

  static setupFog(scene) {
    const fog = new THREE.Fog(0x262837, 1, 15);
    scene.fog = fog;
    return fog;
  }

  static setupRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x262837);
    
    // 启用阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    return renderer;
  }

  static setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(4, 2, 8);
    return camera;
  }

  static setupControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    return controls;
  }
}

// 对象工厂
class ObjectFactory {
  constructor(textureManager) {
    this.textureManager = textureManager;
    this.geometries = {};
    this.materials = {};
  }

  // 创建标准网格并设置UV2坐标
  createMeshWithUV2(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    if (geometry.attributes.uv) {
      mesh.geometry.setAttribute(
        "uv2",
        new THREE.Float32BufferAttribute(geometry.attributes.uv.array, 2)
      );
    }
    return mesh;
  }

  // 创建草地
  createGrass() {
    const geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    const material = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("grassBaseColor"),
      aoMap: this.textureManager.get("grassAmbientOcclusion"),
      displacementMap: this.textureManager.get("grassHeight"),
      displacementScale: 0.2,
      normalMap: this.textureManager.get("grassNormal"),
      roughnessMap: this.textureManager.get("grassRoughness"),
    });

    const grass = this.createMeshWithUV2(geometry, material);
    grass.rotation.x = -Math.PI / 2;
    
    // 草地接收阴影
    grass.receiveShadow = true;
    
    return grass;
  }

  // 创建房子
  createHouse() {
    const house = new THREE.Group();

    // 墙壁
    const wallGeometry = new THREE.BoxGeometry(4, 2.5, 4);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("wallBaseColor"),
      aoMap: this.textureManager.get("wallAmbientOcclusion"),
      normalMap: this.textureManager.get("wallNormal"),
    });

    const wall = this.createMeshWithUV2(wallGeometry, wallMaterial);
    wall.position.y = 0.5 * 2.5;
    
    // 房屋部分投射和接收阴影
    wall.castShadow = true;
    wall.receiveShadow = true;

    // 屋顶
    const roofGeometry = new THREE.ConeGeometry(3.5, 2, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("wallBaseColor"),
    });

    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.5 + 0.5 * 2;
    roof.rotation.y = Math.PI * 0.25;

    // 门
    const doorGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
    const doorMaterial = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("doorBaseColor"),
      alphaMap: this.textureManager.get("doorAlpha"),
      transparent: true,
      aoMap: this.textureManager.get("doorAmbientOcclusion"),
      normalMap: this.textureManager.get("doorNormal"),
      displacementMap: this.textureManager.get("doorHeight"),
      displacementScale: 0.1,
      roughnessMap: this.textureManager.get("doorRoughness"),
      metalnessMap: this.textureManager.get("doorMetalness"),
    });

    const door = this.createMeshWithUV2(doorGeometry, doorMaterial);
    door.position.y = 0.5 * 2 - 0.1;
    door.position.z = 2;
    
    // 门不需要投射阴影
    door.castShadow = false;
    // 门接收阴影
    door.receiveShadow = true;

    house.add(wall, roof, door);
    return house;
  }

  // 创建灌木丛
  createBushes() {
    const bushes = new THREE.Group();
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("bushBaseColor"),
    });

    // 灌木丛配置
    const bushConfigs = [
      { position: [1, 0.2, 2.2], scale: 0.5 },
      { position: [1.6, 0.1, 2.1], scale: 0.4 },
      { position: [-1, 0.1, 2.2], scale: 0.6 },
      { position: [-1.6, 0.05, 2.2], scale: 0.3 },
    ];

    bushConfigs.forEach((config) => {
      const bush = new THREE.Mesh(geometry, material);
      bush.scale.set(config.scale, config.scale, config.scale);
      bush.position.set(...config.position);
      
      // 灌木丛投射和接收阴影
      bush.castShadow = true;
      bush.receiveShadow = true;
      
      bushes.add(bush);
    });

    return bushes;
  }

  // 创建墓碑
  createGraves(count = 40) {
    const graves = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const material = new THREE.MeshStandardMaterial({
      map: this.textureManager.get("graveBaseColor"),
    });

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(geometry, material);
      grave.position.set(x, 0.3, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      
      // 墓碑投射阴影
      grave.castShadow = true;
      grave.receiveShadow = true;

      graves.add(grave);
    }

    return graves;
  }

  // 创建幽灵
  createGhost() {
    const ghost = new THREE.PointLight(0x00ffaa, 2, 3);
    ghost.castShadow = true;
    
    // 优化幽灵的阴影
    ghost.shadow.mapSize.width = 256;
    ghost.shadow.mapSize.height = 256;
    ghost.shadow.camera.far = 7;
    
    return ghost;
  }
}

// 主场景类
class HauntedHouseScene {
  constructor() {
    this.canvas = document.querySelector(".webgl");
    this.textureManager = new TextureManager();
    this.scene = new THREE.Scene();
    this.camera = SceneConfigurator.setupCamera();
    this.renderer = SceneConfigurator.setupRenderer(this.canvas);
    this.controls = SceneConfigurator.setupControls(this.camera, this.canvas);
    this.objectFactory = null;
    this.clock = new THREE.Clock();
    this.animatableObjects = {};

    this.scene.add(this.camera);

    // 创建动画循环
    this.tick = this.tick.bind(this);

    // 设置窗口大小变化事件
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  async init() {
    // 加载所有纹理
    await this.loadTextures();

    // 设置场景
    SceneConfigurator.setupLights(this.scene);
    SceneConfigurator.setupFog(this.scene);

    // 创建对象工厂
    this.objectFactory = new ObjectFactory(this.textureManager);

    // 创建场景元素
    const grass = this.objectFactory.createGrass();
    const house = this.objectFactory.createHouse();
    const bushes = this.objectFactory.createBushes();
    const graves = this.objectFactory.createGraves();
    const ghost = this.objectFactory.createGhost();
    this.animatableObjects.ghost = ghost;

    // 添加到场景
    this.scene.add(grass, house, bushes, graves, ghost);

    // 启动动画循环
    this.tick();
  }

  loadTextures() {
    // 草地纹理
    this.textureManager.load(
      "grassBaseColor",
      "/src/assets/texture/grass/baseColor.jpg",
      {
        repeat: [4, 4],
        wrap: THREE.RepeatWrapping,
      }
    );
    this.textureManager.load(
      "grassAmbientOcclusion",
      "/src/assets/texture/grass/ambientOcclusion.jpg",
      {
        repeat: [4, 4],
        wrap: THREE.RepeatWrapping,
      }
    );
    this.textureManager.load(
      "grassHeight",
      "/src/assets/texture/grass/height.png",
      {
        repeat: [4, 4],
        wrap: THREE.RepeatWrapping,
      }
    );
    this.textureManager.load(
      "grassNormal",
      "/src/assets/texture/grass/normal.jpg",
      {
        repeat: [4, 4],
        wrap: THREE.RepeatWrapping,
      }
    );
    this.textureManager.load(
      "grassRoughness",
      "/src/assets/texture/grass/roughness.jpg",
      {
        repeat: [4, 4],
        wrap: THREE.RepeatWrapping,
      }
    );

    // 墙壁纹理
    this.textureManager.load(
      "wallBaseColor",
      "/src/assets/texture/wall/baseColor.png"
    );
    this.textureManager.load(
      "wallAmbientOcclusion",
      "/src/assets/texture/wall/ambientOcclusion.png"
    );
    this.textureManager.load(
      "wallNormal",
      "/src/assets/texture/wall/normal.png"
    );

    // 门纹理
    this.textureManager.load(
      "doorBaseColor",
      "/src/assets/texture/door/baseColor.jpg"
    );
    this.textureManager.load("doorAlpha", "/src/assets/texture/door/alpha.jpg");
    this.textureManager.load(
      "doorAmbientOcclusion",
      "/src/assets/texture/door/ambientOcclusion.jpg"
    );
    this.textureManager.load(
      "doorHeight",
      "/src/assets/texture/door/height.jpg"
    );
    this.textureManager.load(
      "doorNormal",
      "/src/assets/texture/door/normal.jpg"
    );
    this.textureManager.load(
      "doorRoughness",
      "/src/assets/texture/door/roughness.jpg"
    );
    this.textureManager.load(
      "doorMetalness",
      "/src/assets/texture/door/metalness.jpg"
    );

    // 灌木丛纹理
    this.textureManager.load(
      "bushBaseColor",
      "/src/assets/texture/bush/baseColor.jpg"
    );

    // 墓碑纹理
    this.textureManager.load(
      "graveBaseColor",
      "/src/assets/texture/grave/baseColor.jpg"
    );

    // 为了让函数可以用于异步处理，这里返回一个Promise
    return Promise.resolve();
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime();
    this.updateAnimations(elapsedTime);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.tick);
  }

  // 添加新方法用于更新动画
  updateAnimations(elapsedTime) {
    // 如果有幽灵对象，更新它的位置
    if (this.animatableObjects.ghost) {
      const ghost = this.animatableObjects.ghost;
      // 示例：让幽灵在场景中绕圈移动
      const ghostAngle = elapsedTime * 0.5;
      ghost.position.x = Math.cos(ghostAngle) * 6;
      ghost.position.z = Math.sin(ghostAngle) * 6;
      ghost.position.y =
        Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2) + 0.5;
    }
  }
}

// 启动应用
const hauntedHouseScene = new HauntedHouseScene();
hauntedHouseScene.init();
