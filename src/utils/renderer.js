import * as THREE from "three";

class Renderer {
  constructor(canvas, options = {}) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: options.antialias !== undefined ? options.antialias : true,
      ...options,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (options.shadowMap) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type =
        options.shadowMapType || THREE.PCFSoftShadowMap;
    }
  }

  getRenderer() {
    return this.renderer;
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    return this;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    return this;
  }
}

export default Renderer;
