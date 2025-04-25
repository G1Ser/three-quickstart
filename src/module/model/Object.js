import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ModelObject from "@/utils/Object";
import ModelScene from "./Scene";

class ModelLoader extends ModelObject {
  constructor() {
    super();
    this.loader = new GLTFLoader();
    this.modelScene = new ModelScene();
  }

  /**
   * 获取模型场景
   * @returns {ModelScene} 模型场景实例
   */
  getModelScene() {
    return this.modelScene;
  }

  /**
   * 加载GLTF/GLB模型
   * @param {String} path - 模型路径
   * @param {Object} options - 配置选项
   * @param {Object} options.position - 模型位置，默认{x:0,y:0,z:0}
   * @param {Object} options.rotation - 模型旋转，默认{x:0,y:0,z:0}
   * @param {Object} options.scale - 模型缩放，默认{x:1,y:1,z:1}
   * @returns {Promise} 返回Promise，resolve时传入加载的模型
   */
  loadModel(path, options = {}) {
    const {
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 },
    } = options;

    return new Promise(() => {
      this.loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          
          // 设置位置、旋转和缩放
          model.position.set(position.x, position.y, position.z);
          model.rotation.set(rotation.x, rotation.y, rotation.z);
          model.scale.set(scale.x, scale.y, scale.z);
          
          // 添加到对象中
          this.object.add(model);
          
          // 遍历模型中的所有网格，设置材质和接收阴影
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              // 确保材质正确
              if (child.material) {
                child.material.needsUpdate = true;
              }
            }
          });
        }
      );
    });
  }

  /**
   * 加载Fox模型
   * @param {Object} options - 配置选项
   * @returns {Promise} 返回Promise，resolve时传入加载的Fox模型
   */
  loadFox(options = {}) {
    return this.loadModel('/src/assets/model/Fox.glb', options);
  }
}

export default ModelLoader;
