import * as THREE from "three";

class Camera {
  /**
   * 创建相机实例
   * @param {Object} options
   * @param {Number} options.fov
   * @param {Number} options.aspect
   * @param {Number} options.near
   * @param {Number} options.far
   * @param {Object} options.position
   */
  constructor(options = {}) {
    const {
      fov = 75,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 1000,
      position = { x: 0, y: 0, z: 5 },
    } = options;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this.camera.position.set(position.x, position.y, position.z);

    this.handleResize();
  }

  getCamera() {
    return this.camera;
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

export default Camera;
