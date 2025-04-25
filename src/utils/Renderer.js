import * as THREE from "three";

class Renderer {
  /**
   * 创建渲染器实例
   * @param {Object} options - 渲染器配置选项
   * @param {HTMLElement} options.canvas - 画布元素或选择器
   * @param {Boolean} options.antialias - 是否启用抗锯齿，默认true
   * @param {Boolean} options.alpha - 是否启用透明度，默认false
   * @param {Number} options.pixelRatio - 像素比，默认设备像素比
   * @param {Boolean} options.autoClear - 是否自动清除上一帧，默认true
   */
  constructor(options = {}) {
    const {
      canvas,
      antialias = true,
      alpha = false,
      pixelRatio = window.devicePixelRatio,
      autoClear = true,
    } = options;

    // 创建WebGL渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias,
      alpha,
    });

    // 设置渲染器属性
    this.renderer.setPixelRatio(Math.min(pixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = autoClear;

    // 监听窗口大小变化
    this.handleResize();
  }

  getRenderer() {
    return this.renderer;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  setAnimationLoop(callback) {
    this.renderer.setAnimationLoop(callback);
  }

  handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export default Renderer;
