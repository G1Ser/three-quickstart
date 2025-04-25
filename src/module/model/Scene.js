import Scene from "@/utils/Scene";
import * as THREE from "three";

class ModelScene extends Scene {
  constructor() {
    super();
  }

  /**
   * 更新所有材质，为MeshStandardMaterial添加环境贴图
   * @param {THREE.Texture} environmentMap - 环境贴图
   */
  updateAllMaterials(environmentMap) {
    this.getScene().traverse((child) => {
      console.log(child)
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMap = environmentMap;
      }
    });
    
    return this;
  }
}

export default ModelScene; 