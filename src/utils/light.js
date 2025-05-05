import * as THREE from "three";

class Light {
  constructor(
    type = "directional",
    color = 0xffffff,
    intensity = 1,
    options = {}
  ) {
    switch (type.toLowerCase()) {
      case "directional":
        this.light = new THREE.DirectionalLight(color, intensity);
        break;
      case "ambient":
        this.light = new THREE.AmbientLight(color, intensity);
        break;
      case "point":
        this.light = new THREE.PointLight(
          color,
          intensity,
          options.distance,
          options.decay
        );
        break;
      default:
        this.light = new THREE.DirectionalLight(color, intensity);
    }

    // 设置阴影（如果光源支持）
    if (this.light.shadow && options.castShadow) {
      this.setCastShadow(options.castShadow);

      if (options.shadowMapSize) {
        this.setShadowMapSize(options.shadowMapSize, options.shadowMapSize);
      }
    }

    // 设置位置（如果光源支持）
    if (this.light.position && options.position) {
      this.setPosition(
        options.position.x || 0,
        options.position.y || 0,
        options.position.z || 0
      );
    }
  }

  getLight() {
    return this.light;
  }

  setIntensity(intensity) {
    this.light.intensity = intensity;
    return this;
  }

  setPosition(x, y, z) {
    this.light.position.set(x, y, z);
    return this;
  }

  setCastShadow(castShadow) {
    this.light.castShadow = castShadow;
    return this;
  }

  setShadowMapSize(width, height) {
    this.light.shadow.mapSize.width = width;
    this.light.shadow.mapSize.height = height;
    return this;
  }
}

export default Light;
