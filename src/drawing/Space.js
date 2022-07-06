import * as THREE from "three";

import { ALPHAMAP } from "../constants/url";

class Space {
  constructor(canvas) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this._count = 4000;
    this._distance = 2;

    this._setupModel();
  }

  _setupModel() {
    const textureLoader = new THREE.TextureLoader();
    const alphaMap = textureLoader.load(ALPHAMAP.CIRCLE);

    const points = new Float32Array(this._count * 3);
    const colors = new Float32Array(this._count * 3);

    for (let i = 0; i < points.length; i++) {
      points[i] = THREE.MathUtils.randFloatSpread(this._distance * 2);
      colors[i] = Math.random();
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    pointGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.05,
      alphaMap,
      alphaTest: 0.01,
      vertexColors: true,
      transparent: true,
    });

    this._pointsObject = new THREE.Points(pointGeometry, pointMaterial);

    this._group = new THREE.Group();
    this._group.add(this._pointsObject);

    this._init();
  }

  _init() {
    this.scene = new THREE.Scene();

    this._sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this._setupLight();
    this._setupCamera(this._sizes);
    this._setupControls(this.camera, this._canvas);
    this._render(this._canvas, this._sizes);

    this.scene.add(this._group);

    this._tick(this._sizes);
  }

  _setupLight() {}

  _setupCamera(sizes) {}

  _setupControls(camera, canvas) {}

  _render(canvas, sizes) {}

  _tick(sizes) {}
}

export default Space;
