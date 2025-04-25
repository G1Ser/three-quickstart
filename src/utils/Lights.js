import * as THREE from 'three';

class Lights {
  constructor() {
    this.lights = {};
  }

  createAmbientLight(options = {}) {
    const {
      color = 0xffffff,
      intensity = 1,
      name = 'ambientLight'
    } = options;

    const light = new THREE.AmbientLight(color, intensity);
    this.lights[name] = light;
    return light;
  }

  createDirectionalLight(options = {}) {
    const {
      color = 0xffffff,
      intensity = 1,
      position = { x: 1, y: 1, z: 1 },
      name = 'directionalLight'
    } = options;

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    this.lights[name] = light;
    return light;
  }

  createPointLight(options = {}) {
    const {
      color = 0xffffff,
      intensity = 1,
      distance = 0,
      decay = 2,
      position = { x: 0, y: 1, z: 0 },
      castShadow = false,
      name = 'pointLight'
    } = options;

    const light = new THREE.PointLight(color, intensity, distance, decay);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = castShadow;

    this.lights[name] = light;
    return light;
  }

  /**
   * 移除光源
   * @param {String} name - 光源名称
   */
  removeLight(name) {
    delete this.lights[name];
  }
}

export default Lights; 