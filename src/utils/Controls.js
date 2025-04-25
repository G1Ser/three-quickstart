import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Controls {
  constructor(camera, canvas) {
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true;
  }

  getControls() {
    return this.controls;
  }

  update() {
    this.controls.update();
  }
}

export default Controls;
