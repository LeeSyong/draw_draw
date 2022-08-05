import * as THREE from "three";

class BackgroundModel {
  constructor(alphamap) {
    this._alphaMap = alphamap;

    this._init();
  }

  _init() {
    this._createGeometry();
    this._createMaterial();
    this._createPoints();
  }

  _createGeometry() {
    const COUNT = 4000;
    const DISTANCE = 2;

    const points = new Float32Array(COUNT * 3).map((point) =>
      THREE.MathUtils.randFloatSpread(DISTANCE * 2),
    );
    const colors = new Float32Array(COUNT * 3).map((color) => Math.random());

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );
  }

  _createMaterial() {
    this.material = new THREE.PointsMaterial({
      size: 0.03,
      alphaMap: this._alphaMap,
      alphaTest: 0.01,
      vertexColors: true,
      transparent: true,
    });
  }

  _createPoints() {
    this.points = new THREE.Points(this.geometry, this.material);

    this.group = new THREE.Group();
    this.group.add(this.points);
  }
}

export default BackgroundModel;
