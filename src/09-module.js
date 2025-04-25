import { Scene, Camera, Renderer, Lights } from "./utils";
import "./assets/style/style.css";

const canvas = document.querySelector(".webgl");

const scene = new Scene();
const cameraInstance = new Camera();
const camera = cameraInstance.getCamera();
const renderer = new Renderer({ canvas });
const lights = new Lights();
const ambientLight = lights.createAmbientLight();
scene.add([camera, ambientLight]);

// 创建渲染函数
function render() {
  renderer.render(scene.getScene(), camera);
}

// 初始渲染
render();

window.addEventListener("resize", () => {
  cameraInstance.handleResize();
  renderer.handleResize();
  render();
});
