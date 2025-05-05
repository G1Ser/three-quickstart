import * as THREE from "three";

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
  }

  getScene() {
    return this.scene;
  }

  addObject(object) {
    this.scene.add(object);
  }

  removeObject(object) {
    this.scene.remove(object);
  }
}

export default Scene;
