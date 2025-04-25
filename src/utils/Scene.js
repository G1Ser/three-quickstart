import * as THREE from "three";

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
  }

  getScene() {
    return this.scene;
  }

  add(objects) {
    if (Array.isArray(objects)) {
      objects.forEach((object) => this.scene.add(object));
    } else {
      this.scene.add(objects);
    }
  }

  remove(objects) {
    if (Array.isArray(objects)) {
      objects.forEach((object) => this.scene.remove(object));
    } else {
      this.scene.remove(objects);
    }
  }
}

export default Scene;
