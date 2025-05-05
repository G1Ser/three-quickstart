import * as THREE from "three";

class Camera {
  constructor(
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 1000
  ) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  getCamera() {
    return this.camera;
  }

  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
    return this;
  }

  updateAspect(aspect) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    return this;
  }
}

export default Camera;
