import { Camera, Renderer, Lights, Controls } from "./utils";
import { ModelGUI, ModelLoader, ModelScene } from "./module/model";
import { CubeTextureLoader } from "three";
import "@assets/style/style.css";

const canvas = document.querySelector(".webgl");

const scene = new ModelScene();
const cameraInstance = new Camera({ position: { x: 0, y: 1, z: 3 } });
const camera = cameraInstance.getCamera();
const renderer = new Renderer({ canvas });
const lights = new Lights();
const controls = new Controls(camera, canvas);
const ambientLight = lights.createAmbientLight();
const directionalLight = lights.createDirectionalLight();

// 创建模型加载器实例
const modelLoader = new ModelLoader();
// 加载Fox模型
modelLoader.loadFox({
  rotation: { x: 0, y: -Math.PI * 0.25, z: 0 },
  scale: { x: 0.015, y: 0.015, z: 0.015 },
});

// 只在开发环境中初始化 GUI
if (import.meta.env.DEV) {
  const gui = new ModelGUI();
  gui.init(directionalLight, modelLoader);
}

// 加载环境贴图
const cubeTextureLoader = new CubeTextureLoader();
cubeTextureLoader.setPath("/src/assets/texture/environment/pure-sky/");
cubeTextureLoader.load(
  ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
  (texture) => {
    // 设置主场景的环境贴图
    scene.setEnvironmentMap(texture);
    scene.updateAllMaterials(texture);
  }
);

// 将对象添加到主场景
scene.add([camera, ambientLight, directionalLight, modelLoader.getObject()]);
// 创建渲染函数
function render() {
  renderer.render(scene.getScene(), camera);
}

function animate() {
  controls.update();
  render();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  cameraInstance.handleResize();
  renderer.handleResize();
});

animate();
