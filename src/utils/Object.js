import * as THREE from "three";

class ModelObject {
  constructor() {
    this.object = new THREE.Object3D();
  }

  /**
   * 获取对象实例
   * @returns {THREE.Object3D} 三维对象
   */
  getObject() {
    return this.object;
  }

  /**
   * 创建一个正方体并添加到对象中
   * @param {Object} options - 正方体配置选项
   * @param {Number} options.size - 正方体边长，默认1
   * @param {String|Number} options.color - 正方体颜色，默认白色
   * @param {Boolean} options.wireframe - 是否显示线框，默认false
   * @param {Object} options.position - 正方体位置，默认{x:0,y:0,z:0}
   * @param {Object} options.rotation - 正方体旋转，默认{x:0,y:0,z:0}
   * @returns {THREE.Mesh} 正方体网格对象
   */
  createCube(options = {}) {
    const {
      size = 1,
      color = 0xffffff,
      wireframe = false,
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
    } = options;

    // 创建几何体
    const geometry = new THREE.BoxGeometry(size, size, size);

    // 创建材质
    const material = new THREE.MeshStandardMaterial({
      color,
      wireframe,
    });

    // 创建网格
    const cube = new THREE.Mesh(geometry, material);

    // 设置位置
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(rotation.x, rotation.y, rotation.z);
    // 将网格添加到对象中
    this.object.add(cube);

    return cube;
  }

  /**
   * 创建一个球体并添加到对象中
   * @param {Object} options - 球体配置选项
   * @param {Number} options.radius - 球体半径，默认0.5
   * @param {Number} options.widthSegments - 水平分段数，默认32
   * @param {Number} options.heightSegments - 垂直分段数，默认16
   * @param {String|Number} options.color - 球体颜色，默认白色
   * @param {Boolean} options.wireframe - 是否显示线框，默认false
   * @param {Object} options.position - 球体位置，默认{x:0,y:0,z:0}
   * @returns {THREE.Mesh} 球体网格对象
   */
  createSphere(options = {}) {
    const {
      radius = 0.5,
      widthSegments = 32,
      heightSegments = 16,
      color = 0xffffff,
      wireframe = false,
      position = { x: 0, y: 0, z: 0 },
    } = options;

    // 创建几何体
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    // 创建材质
    const material = new THREE.MeshStandardMaterial({
      color,
      wireframe,
    });

    // 创建网格
    const sphere = new THREE.Mesh(geometry, material);

    // 设置位置
    sphere.position.set(position.x, position.y, position.z);

    // 将网格添加到对象中
    this.object.add(sphere);

    return sphere;
  }

  /**
   * 设置对象位置
   * @param {Number} x - X坐标
   * @param {Number} y - Y坐标
   * @param {Number} z - Z坐标
   * @returns {Object} 对象实例本身，用于链式调用
   */
  setPosition(x, y, z) {
    this.object.position.set(x, y, z);
    return this;
  }

  /**
   * 设置对象旋转
   * @param {Number} x - X轴旋转角度
   * @param {Number} y - Y轴旋转角度
   * @param {Number} z - Z轴旋转角度
   * @returns {Object} 对象实例本身，用于链式调用
   */
  setRotation(x, y, z) {
    this.object.rotation.set(x, y, z);
    return this;
  }

  /**
   * 设置对象缩放
   * @param {Number} x - X轴缩放
   * @param {Number} y - Y轴缩放
   * @param {Number} z - Z轴缩放
   * @returns {Object} 对象实例本身，用于链式调用
   */
  setScale(x, y, z) {
    this.object.scale.set(x, y, z);
    return this;
  }
}

export default ModelObject;
