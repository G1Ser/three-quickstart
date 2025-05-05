import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Controls {
  constructor(camera, canvas) {
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true;
  }

  getControls() {
    return this.controls;
  }

  setEnableDamping(value) {
    this.controls.enableDamping = value;
    return this;
  }

  setDistance(min, max) {
    this.controls.minDistance = min;
    this.controls.maxDistance = max;
    return this;
  }

  setPolarAngle(min, max) {
    this.controls.minPolarAngle = min;
    this.controls.maxPolarAngle = max;
    return this;
  }

  setAzimuthAngle(min, max) {
    this.controls.minAzimuthAngle = min;
    this.controls.maxAzimuthAngle = max;
    return this;
  }

  update() {
    this.controls.update();
    return this;
  }
}

export default Controls;
