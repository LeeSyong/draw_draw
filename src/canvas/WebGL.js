import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import chroma from "chroma-js";
import gsap from "gsap";
import { autorun } from "mobx";

import stepStore from "../store/stepStore";
import suggestStore from "../store/suggestStore";

import { STEP } from "../constants/step";
import { MODE } from "../constants/mode";

import { ALPHAMAP } from "../constants/url";

import FontJSON from "../../assets/Do Hyeon_Regular.json";

class WebGLCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this._count = 4000;
    this._distance = 2;
    this._mouseX = 0;
    this._mouseY = 0;

    this._vertexShader = document.querySelector("#vertex-shader").textContent;
    this._fragmentShader =
      document.querySelector("#fragment-shader").textContent;

    autorun(async () => {
      if (stepStore.currentStep === STEP.SUGGEST) {
        if (stepStore.currentMode === MODE.PICTURE) {
          await this._setupSuggestionsModel();
        } else {
          this._setupTextModel();
        }
      } else {
        this._setupBackgroundModel();
      }
    });

    window.addEventListener("wheel", this._zoom.bind(this), {
      passive: false,
    });
  }

  _setupBackgroundModel() {
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

    this._backgroundPoints = new THREE.Points(pointGeometry, pointMaterial);

    this._backgroundGroup = new THREE.Group();
    this._backgroundGroup.add(this._backgroundPoints);

    this._init();
  }

  async _setupSuggestionsModel() {
    const res = await fetch(suggestStore.suggestionUrl);
    const text = await res.text();
    const svg = new DOMParser()
      .parseFromString(text, "image/svg+xml")
      .querySelector("svg");
    document.body.appendChild(svg);

    const svgViewBoxWidth = svg.viewBox.baseVal.width;
    const svgViewBoxHeight = svg.viewBox.baseVal.height;

    const paths = svg.querySelectorAll("path");
    svg.remove();

    this._vertices = [];
    const colors = [];
    const sizes = [];
    const delay = 1;
    const gradient = chroma.scale([
      "ef476f",
      "ffd166",
      "06d6a0",
      "118ab2",
      "073b4c",
    ]);
    const colorRGB = {
      r: Math.random() * 100,
      g: Math.random() * 100,
      b: Math.random() * 100,
    };
    const positionXYZ = {
      x: Math.random() * 3000,
      y: Math.random() * 3000,
      z: Math.random() * 3000,
    };

    const timeline = gsap.timeline({
      onReverseComplete: () => {
        timeline.timeScale(1);
        timeline.play(0);
      },
    });

    paths.forEach((path) => {
      const length = path.getTotalLength();

      for (let i = 0; i < length; i += 30) {
        const pointLength = i;
        const point = path.getPointAtLength(pointLength);

        const vector = new THREE.Vector3(
          point.x - svgViewBoxWidth / 2,
          -point.y + svgViewBoxHeight / 2,
          (Math.random() - 0.5) * 15,
        );

        const start = new THREE.Vector3(
          vector.x + (Math.random() - 0.5) * positionXYZ.x,
          vector.y + (Math.random() - 0.5) * positionXYZ.y,
          vector.z + (Math.random() - 0.5) * positionXYZ.z,
        );

        const coloursX =
          point.x / svgViewBoxWidth + (Math.random() - 0.5) * 0.2;
        const color = gradient(coloursX).rgb();

        this._vertices.push(vector);

        vector.r = 1 - (vector.z + 7.5) / colorRGB.r;
        vector.g = 1 - (vector.z + 7.5) / colorRGB.g;
        vector.b = 1 - (vector.z + 7.5) / colorRGB.b;

        timeline.from(
          vector,
          {
            x: start.x,
            y: start.y,
            z: start.z,
            r: color[0] / 255,
            g: color[1] / 255,
            b: color[2] / 255,
            duration: "random(0.5, 1.5)",
            ease: "power2.out",
          },
          delay * 0.0012,
        );

        sizes.push(25 * this.renderer.getPixelRatio());
      }
    });

    this._geometry = new THREE.BufferGeometry().setFromPoints(this._vertices);

    this._geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );
    this._geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1),
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: {
          value: new THREE.TextureLoader().load(ALPHAMAP.CIRCLE),
        },
      },
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      transparent: true,
      depthTest: false,
    });

    this._suggestionPoints = new THREE.Points(this._geometry, material);
    this._suggestionPoints.scale.set(0.09, 0.09, 0.09);

    this._suggestionGroup = new THREE.Group();
    this._suggestionGroup.add(this._suggestionPoints);

    this._init();
  }

  _setupTextModel() {
    const loader = new FontLoader();
    const font = loader.parse(FontJSON);

    const textGeometry = new TextGeometry(suggestStore.text, {
      font,
      size: 50,
      height: 10,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 3,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 12,
    });

    const textMaterial = new THREE.MeshNormalMaterial();

    this._textMesh = new THREE.Mesh(textGeometry, textMaterial);
    this._textMesh.position.set(0, 0, -240);
    this._textMesh.geometry.center();

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

    this.scene.add(this._backgroundGroup);

    this._tick(this._sizes);

    window.addEventListener("resize", () => this._resize());
    window.addEventListener("mousemove", this._mousemove.bind(this));
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
      5000,
    );

    camera.position.set(0, 0, 2);

    this.scene.add(camera);
    this.camera = camera;
  }

  _setupControls(camera, canvas) {
    const control = new OrbitControls(camera, canvas);

    control.enableDamping = true;

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

    this._backgroundPoints.rotation.y = elapsedTime * 0.3;

    if (stepStore.currentStep === STEP.SUGGEST) {
      this.scene.remove(this._backgroundGroup);

      if (stepStore.currentMode === MODE.PICTURE) {
        this.scene.remove(this._textMesh);

        if (this._suggestionGroup) {
          this.camera.position.z = 400;

          this.scene.add(this._suggestionGroup);

          this._geometry.setFromPoints(this._vertices);

          const colours = [];
          this._vertices.forEach((vector) => {
            colours.push(vector.r, vector.g, vector.b);
          });
          this._geometry.setAttribute(
            "customColor",
            new THREE.Float32BufferAttribute(colours, 3),
          );
        }
      } else {
        this.scene.remove(this._suggestionGroup);
        this.scene.add(this._textMesh);
      }
    } else {
      this.scene.remove(this._suggestionGroup);
      this.scene.add(this._backgroundGroup);
    }

    if (this._textMesh) {
      const time = Date.now() * 0.003;
      const rotationY = Math.sin(time * 0.5) * 0.3;

      this._textMesh.rotation.y = rotationY;
    }

    this.renderer.render(this.scene, this.camera);
    this.control.update();
    window.requestAnimationFrame(this._tick.bind(this, sizes));
  }

  _mousemove(event) {
    if (stepStore.currentStep === STEP.SUGGEST) {
      const mouseX =
        (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY =
        (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      gsap.to(this._suggestionGroup.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        ease: "power2.out",
        duration: 2,
      });
    } else {
      this._mouseX = event.clientX;
      this._mouseY = event.clientY;

      const ratioX = (this._mouseX / window.innerWidth - 0.5) * 2;
      const ratioY = (this._mouseY / window.innerHeight - 0.5) * 2;

      this._backgroundGroup.rotation.y = ratioX * Math.PI * 0.1;
      this._backgroundGroup.rotation.x = ratioY * Math.PI * 0.1;
    }
  }

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _zoom(event) {
    event.preventDefault();

    let { zoom } = this.camera;

    zoom += event.deltaY * -0.001;
    zoom = Math.min(Math.max(0.7, zoom), 1.7);

    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
  }
}

export default WebGLCanvas;
