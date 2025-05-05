import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Loader {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.gltfLoader = new GLTFLoader();
  }

  loadTexture(path) {
    return this.textureLoader.load(path);
  }

  loadCubeTexture(paths, basePath = "") {
    if (basePath) {
      this.cubeTextureLoader.setPath(basePath);
    }
    return this.cubeTextureLoader.load(paths);
  }

  loadGLTF(path, onLoad) {
    this.gltfLoader.load(path, onLoad);
  }
}

export default Loader;
