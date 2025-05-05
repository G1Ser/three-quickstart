import * as THREE from "three";

class FoxModel {
  constructor() {
    this.model = null;
    this.animations = null;
    this.mixer = null;
    this.actions = {};
    this.activeAction = null;
    this.animationNameMap = {
      Survey: "观察",
      Walk: "行走",
      Run: "奔跑",
    };
  }

  setModel(model, animations) {
    this.model = model;
    this.animations = animations;
    this.mixer = new THREE.AnimationMixer(this.model);

    // 创建每个动画的 action
    this.animations.forEach((clip) => {
      this.actions[this.animationNameMap[clip.name]] =
        this.mixer.clipAction(clip);
    });

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    return this;
  }

  getModel() {
    return this.model;
  }

  getMixer() {
    return this.mixer;
  }

  playAnimation(name) {
    if (this.activeAction) this.activeAction.stop();

    if (name === "无动画") {
      this.activeAction = null;
      return this;
    }

    this.activeAction = this.actions[name];
    if (this.activeAction) {
      this.activeAction.reset().play();
    }

    return this;
  }

  stopAnimation() {
    if (this.activeAction) {
      this.activeAction.stop();
      this.activeAction = null;
    }
    return this;
  }

  updateMixer(delta) {
    if (this.mixer) this.mixer.update(delta);
    return this;
  }

  setPosition(x, y, z) {
    if (this.model) {
      this.model.position.set(x, y, z);
    }
    return this;
  }

  setRotation(x, y, z) {
    if (this.model) {
      this.model.rotation.set(x, y, z);
    }
    return this;
  }

  setScale(scale) {
    if (this.model) {
      this.model.scale.set(scale, scale, scale);
    }
    return this;
  }

  getAnimationNames() {
    return ["无动画", ...Object.values(this.animationNameMap)];
  }
}

export default FoxModel;
