# 图形用户界面

### 1. [dat.GUI](https://github.com/dataarts/dat.gui)

A simple but complete example: [example](https://jsfiddle.net/ikatyang/182ztwao/)

### 2. [control-panel](https://github.com/freeman-lab/control-panel)

### 3. [ControlKit](https://github.com/automat/controlkit.js)

### 4. [Guify](https://github.com/colejd/guify)

### 5. [Oui](https://github.com/wearekuva/oui)

# Three 纹理素材

### 1. [POLIIGON](https://www.poliigon.com/)

### 2. [3D TEXTURES](https://3dtextures.me/)

### 3. [arroway-textures](https://www.arroway-textures.ch/)

### 4. [Poly Heaveb](https://polyhaven.com/) [HDRI to CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/)

# GLB 模型素材

### 1. [Sketchfab](https://sketchfab.com/feed)

### 2. [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free)

### 3. [CGTrader](https://www.cgtrader.com/free-3d-models)

### 4.[Free3D](https://free3d.com/3d-models/animated-blender)

### 5.[Clara.io](https://clara.io/library)

### 6.[BlendSwap](https://www.blendswap.com/)

### 7.[Archive3D](https://free3d.io/#gsc.tab=0)

### 8.[3DExport](https://3dexport.com/)

### 9.[NASA 3D Resources](https://nasa3d.arc.nasa.gov/)

### 10.[GrabCAD](https://grabcad.com/library)

# Material 材质

### 1.LineBasicMaterial 用于绘制几何体框线

```typescript
const material = new THREE.LineBasicMaterial({
  color,
  linewdith,
});
```

### 2.LineDashedMaterial 用虚线绘制几何体框线

```typescript
const material = new THREE.LineDashedMaterial({
  color,
  linewidth,
});
```

### 3.MeshBasicMaterial 基础网络材质（不考虑复杂的光照效果，仅根据颜色或纹理来渲染几何体）

```typescript
const material = new THREE.MeshBasicMaterial({
  color,
});
```

### 4.MeshDepthMaterial 深度网络材质（基于相机的远近来渲染几何体，白色最近，黑色最远 雾的制作）

### 5.MeshDistanceMaterial 距离网络材质（根据内部点光源来反射阴影）

### 6.MeshLambertMaterial 兰伯特网络材质（漫反射光照模型 适用于非反射性物体）

### 7.MeshMatcapMaterial 贴图网络材质（光照效果由贴图生成，不受光源影响）

### 8.MeshNormalMaterial 普通网络材质（将法向量映射到 RGB 色系上）

### 9.MeshPhongMaterial 冯网络材质（适用于反射性物体）

### 10.MeshStandardMaterial 基础 PBR 物理模型（金属度、粗糙度）

### 11.MeshPhysicalMaterial 真实 PBR 物体模型（基于 Standar 的拓展 能更好的反应真实的物理场景材质）

### 12.MeshToonMaterial 卡通网络材质（卡通风格）

### 13.PointMaterial 点材质（粒子特效）

### 14.RawShaderMaterial ShaderMaterial 基于 shader 着色器渲染的材质

### SpriteMaterial 2.5D 场景

### ShadowMaterial 模拟真实光影
