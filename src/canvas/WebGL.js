import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { ALPHAMAP } from "../constants/url";

class WebGLCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this._count = 4000;
    this._distance = 2;
    this._mouseX = 0;
    this._mouseY = 0;

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

    window.addEventListener("resize", () => this._resize());
    window.addEventListener("mousemove", (event) => this._mousemove(event));
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    this.scene.add(light);
  }

  _setupCamera(sizes) {
    const camera = new THREE.PerspectiveCamera(
      25,
      sizes.width / sizes.height,
      0.01,
      1000,
    );

    camera.position.set(0, 0, 2);

    this.scene.add(camera);
    this.camera = camera;
  }

  _setupControls(camera, canvas) {
    const control = new OrbitControls(camera, canvas);

    control.enableDamping = true;
    control.maxDistance = 1.5;
    control.maxDistance = 3.5;

    this.control = control;
  }

  _render(canvas, sizes) {
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer = renderer;
  }

  _tick(sizes) {
    const elapsedTime = this._clock.getElapsedTime();
    this._pointsObject.rotation.y = elapsedTime * 0.3;

    this.renderer.render(this.scene, this.camera);
    this.control.update();
    window.requestAnimationFrame(this._tick.bind(this, sizes));
  }

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _mousemove(event) {
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;

    const ratioX = (this._mouseX / window.innerWidth - 0.5) * 2;
    const ratioY = (this._mouseY / window.innerHeight - 0.5) * 2;
    this._group.rotation.y = ratioX * Math.PI * 0.1;
    this._group.rotation.x = ratioY * Math.PI * 0.1;
  }
}

export default WebGLCanvas;
