import { Scene } from "@/utils";
import * as THREE from "three";

class ModelScene extends Scene {
  constructor() {
    super();
    this.environmentMap = null;
    this.envMapIntensity = 2.0;
  }

  setBackground(background) {
    this.scene.background = background;
  }

  setEnvironmentMap(environmentMap) {
    this.environmentMap = environmentMap;
  }

  setEnvMapIntensity(intensity) {
    this.envMapIntensity = intensity;
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = this.envMapIntensity;
      }
    });
  }
}

export default ModelScene;
