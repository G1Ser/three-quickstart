import * as dat from "dat.gui";

class GUI {
  constructor() {
    this.gui = new dat.GUI();
    this.folders = {};
  }

  getGUI() {
    return this.gui;
  }

  addFolder(name) {
    this.folders[name] = this.gui.addFolder(name);
    return this.folders[name];
  }

  getFolder(name) {
    return this.folders[name];
  }

  addControl(object, property, options = {}) {
    let control;

    if (options.min !== undefined && options.max !== undefined) {
      if (options.step !== undefined) {
        control = this.gui.add(
          object,
          property,
          options.min,
          options.max,
          options.step
        );
      } else {
        control = this.gui.add(object, property, options.min, options.max);
      }
    } else {
      control = this.gui.add(object, property);
    }

    if (options.name !== undefined) control.name(options.name);
    if (options.onChange !== undefined) control.onChange(options.onChange);

    return control;
  }

  addFolderControl(folderName, object, property, options = {}) {
    if (!this.folders[folderName]) {
      this.addFolder(folderName);
    }

    const folder = this.folders[folderName];
    let control;

    if (options.min !== undefined && options.max !== undefined) {
      if (options.step !== undefined) {
        control = folder.add(
          object,
          property,
          options.min,
          options.max,
          options.step
        );
      } else {
        control = folder.add(object, property, options.min, options.max);
      }
    } else {
      control = folder.add(object, property);
    }

    if (options.name !== undefined) control.name(options.name);
    if (options.onChange !== undefined) control.onChange(options.onChange);

    return control;
  }

  openFolder(name) {
    if (this.folders[name]) {
      this.folders[name].open();
    }
    return this;
  }
}

export default GUI;
