import { GUI } from "@/utils";

class ModelGUI {
  constructor(scene, debugObject, directionalLight, fox) {
    this.scene = scene;
    this.debugObject = debugObject;
    this.directionalLight = directionalLight;
    this.fox = fox;
    this.gui = new GUI();
    this.foxFolder = null;
  }

  setup() {
    this.setupEnvironmentControls();
    this.setupLightControls();
    this.setupFoxControls();
    this.gui.openFolder("狐狸控制");
    return this;
  }

  setupEnvironmentControls() {
    // 环境光强度控制
    this.gui.addControl(this.debugObject, "envMapIntensity", {
      min: 0,
      max: 5,
      step: 0.001,
      name: "环境光强度",
      onChange: () => {
        this.scene.setEnvMapIntensity(this.debugObject.envMapIntensity);
        this.scene.updateAllMaterials();
      },
    });
    return this;
  }

  setupLightControls() {
    // 直射光控制
    const light = this.directionalLight.getLight();
    this.gui.addControl(light.position, "x", {
      min: -10,
      max: 10,
      step: 0.001,
      name: "光源位置X",
    });
    this.gui.addControl(light.position, "y", {
      min: -10,
      max: 10,
      step: 0.001,
      name: "光源位置Y",
    });
    this.gui.addControl(light.position, "z", {
      min: -10,
      max: 10,
      step: 0.001,
      name: "光源位置Z",
    });
    this.gui.addControl(light, "intensity", {
      min: 0,
      max: 3,
      step: 0.001,
      name: "光源强度",
    });
    return this;
  }

  setupFoxControls() {
    // 狐狸控制组
    this.foxFolder = this.gui.addFolder("狐狸控制");

    // 位置和旋转控制
    this.gui.addFolderControl("狐狸控制", this.debugObject.foxPosition, "x", {
      min: -3,
      max: 3,
      step: 0.001,
      name: "X位置",
    });
    this.gui.addFolderControl("狐狸控制", this.debugObject.foxPosition, "z", {
      min: -3,
      max: 3,
      step: 0.001,
      name: "Z位置",
    });
    this.gui.addFolderControl("狐狸控制", this.debugObject.foxRotation, "y", {
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      name: "Y旋转",
    });
    this.gui.addFolderControl("狐狸控制", this.debugObject, "foxScale", {
      min: 0.001,
      max: 0.05,
      step: 0.001,
      name: "缩放",
    });

    this.setupAnimationControls();
    return this;
  }

  setupAnimationControls() {
    // 动画控制
    const animationNames = this.fox.getAnimationNames();
    const animObj = { 当前动画: animationNames[0] };
    this.foxFolder
      .add(animObj, "当前动画", animationNames)
      .name("动画选择")
      .onChange((name) => this.fox.playAnimation(name));
    return this;
  }
}

export default ModelGUI;
