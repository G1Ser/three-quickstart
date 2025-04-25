import GUI from "@/utils/GUI";

class ModelGUI extends GUI {
  constructor() {
    super();
    this.modelControls = {
      rotation: { x: 0, y: -Math.PI * 0.25, z: 0 },
      scale: 0.015
    };
  }

  init(directionalLight, modelLoader) {
    // 灯光控制
    this.add(directionalLight, "intensity").min(0).max(10).step(0.01).name('灯光强度');
    
    // 旋转控制
    this.add(this.modelControls.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('Y轴旋转')
      .onChange(() => this.updateFoxTransform(modelLoader));
    
    // 缩放控制
    this.add(this.modelControls, 'scale').min(0.001).max(0.1).step(0.001).name('整体缩放')
      .onChange(() => this.updateFoxTransform(modelLoader));
  }
  
  updateFoxTransform(modelLoader) {
    const fox = modelLoader.getObject();
    if (fox && fox.children.length > 0) {
      // 假设第一个子对象是Fox模型
      const foxModel = fox.children[0];
      if (foxModel) {
        // 更新旋转
        foxModel.rotation.set(
          this.modelControls.rotation.x,
          this.modelControls.rotation.y,
          this.modelControls.rotation.z
        );
        
        // 更新缩放（统一缩放）
        const scale = this.modelControls.scale;
        foxModel.scale.set(scale, scale, scale);
      }
    }
  }
}

export default ModelGUI;
