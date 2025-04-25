import * as dat from "dat.gui";

class GUI {
  constructor() {
    this.gui = new dat.GUI();
  }

  add(object, property) {
    return this.gui.add(object, property);
  }
}

export default GUI;
