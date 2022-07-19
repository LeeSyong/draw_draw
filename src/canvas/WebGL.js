import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { autorun } from "mobx";

import stepStore from "../store/stepStore";
import suggestStore from "../store/suggestStore";

import { STEP } from "../constants/step";
import { MODE } from "../constants/mode";
import { ALPHAMAP } from "../constants/url";

import svgConverter from "../utils/svgCreator";

import SuggestionModel from "./Models/SuggestionModel";

class WebGLCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this._count = 4000;
    this._distance = 2;

    this._vertexShader = document.querySelector("#vertex-shader").textContent;
    this._fragmentShader =
      document.querySelector("#fragment-shader").textContent;

    autorun(async () => {
      if (stepStore.currentStep === STEP.SUGGEST) {
        if (suggestStore.text === "") {
          await this._setupPictureModel();
        } else {
          await this._setupLetterModel();
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

  async _setupPictureModel() {
    const svg = await svgConverter.createSvgImg(suggestStore.suggestionUrl);
    const circles = svg.querySelectorAll("circle");
    const ratio = this.renderer.getPixelRatio();

    if (circles.length) {
      svgConverter.convertCircleToPath(circles, svg);
    }

    this._pictureModel = new SuggestionModel(svg, this.scene, ratio);

    this._init();
  }

  async _setupLetterModel() {
    const svg = await svgConverter.createSvgText(suggestStore.text);
    const ratio = this.renderer.getPixelRatio();

    this._letterModel = new SuggestionModel(svg, this.scene, ratio);

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
    if (stepStore.currentStep === STEP.SUGGEST) {
      this.scene.remove(this._backgroundGroup);

      const modelToRemove =
        stepStore.currentMode === MODE.PICTURE
          ? this._letterModel
          : this._pictureModel;

      const modelToAdd =
        stepStore.currentMode === MODE.PICTURE
          ? this._pictureModel
          : this._letterModel;

      this.scene.remove(modelToRemove?.group);

      if (modelToAdd?.group) {
        this.camera.position.z = 400;

        this.scene.add(modelToAdd.group);

        modelToAdd.geometry.setFromPoints(modelToAdd.vertices);

        const colours = [];
        modelToAdd.vertices.forEach((vector) => {
          colours.push(vector.r, vector.g, vector.b);
        });
        modelToAdd.geometry.setAttribute(
          "customColor",
          new THREE.Float32BufferAttribute(colours, 3),
        );
      }
    } else {
      const elapsedTime = this._clock.getElapsedTime();
      this._backgroundPoints.rotation.y = elapsedTime * 0.3;

      this.scene.remove(this._pictureModel?.group);
      this.scene.remove(this._letterModel?.group);
      this.scene.add(this._backgroundGroup);
    }

    this.renderer.render(this.scene, this.camera);
    this.control.update();
    window.requestAnimationFrame(this._tick.bind(this, sizes));
  }

  _mousemove(event) {
    if (stepStore.currentStep === STEP.SUGGEST) {
      const mesh =
        stepStore.currentMode === MODE.PICTURE
          ? this._pictureModel?.group
          : this._letterModel?.group;

      const mouseX =
        (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY =
        (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      gsap.to(mesh.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        ease: "power2.out",
        duration: 2,
      });
    } else {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const ratioX = (mouseX / window.innerWidth - 0.5) * 2;
      const ratioY = (mouseY / window.innerHeight - 0.5) * 2;

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
