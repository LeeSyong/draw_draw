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

import BackgroundModel from "./Models/BackgroundModel";
import SuggestionModel from "./Models/SuggestionModel";

class WebGLCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    this.alphaMap = textureLoader.load(ALPHAMAP.CIRCLE);

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

    this._init();
  }

  _setupBackgroundModel() {
    this._removeObject(this._backgroundModel);
    this._removeObject(this._pictureModel);
    this._removeObject(this._letterModel);

    this._backgroundModel = new BackgroundModel(this.alphaMap);

    this.scene.add(this._backgroundModel.group);
  }

  async _setupPictureModel() {
    this._removeObject(this._backgroundModel);
    this._removeObject(this._pictureModel);

    const svg = await svgConverter.createSvgImg(suggestStore.suggestionUrl);
    const circles = svg.querySelectorAll("circle");
    const ratio = this.renderer.getPixelRatio();

    if (circles.length) {
      svgConverter.convertCircleToPath(circles, svg);
    }

    this._pictureModel = new SuggestionModel(svg, this.scene, ratio);

    this.scene.add(this._pictureModel.group);
  }

  async _setupLetterModel() {
    this._removeObject(this._backgroundModel);
    this._removeObject(this._letterModel);

    const svg = await svgConverter.createSvgText(suggestStore.text);
    const ratio = this.renderer.getPixelRatio();

    this._letterModel = new SuggestionModel(svg, this.scene, ratio);

    this.scene.add(this._letterModel.group);
  }

  _init() {
    this._sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this._setupLight();
    this._setupCamera(this._sizes);
    this._setupControls(this.camera, this._canvas);
    this._render(this._canvas, this._sizes);

    this._tick(this._sizes);

    window.addEventListener("resize", this._resize.bind(this));
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

    camera.position.z = 2;

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
      const modelToAdd =
        stepStore.currentMode === MODE.PICTURE
          ? this._pictureModel
          : this._letterModel;

      if (modelToAdd?.group) {
        this.camera.position.z = 400;

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
      this.camera.position.z = 2;

      const elapsedTime = this._clock.getElapsedTime();

      this._backgroundModel.points.rotation.y = elapsedTime * 0.2;

      this.scene.add(this._backgroundModel.group);
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

      if (mesh) {
        gsap.to(mesh.rotation, {
          x: mouseY * 0.5,
          y: mouseX * 0.5,
          ease: "power2.out",
          duration: 2,
        });
      }
    } else {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const ratioX = (mouseX / window.innerWidth - 0.5) * 2;
      const ratioY = (mouseY / window.innerHeight - 0.5) * 2;

      this._backgroundModel.group.rotation.y = ratioX * Math.PI * 0.1;
      this._backgroundModel.group.rotation.x = ratioY * Math.PI * 0.1;
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

  _removeObject(obj) {
    while (obj?.group?.children?.length > 0) {
      this._removeObject(obj.group.children[0]);

      obj.group.remove(obj.group.children[0]);

      this.scene.remove(obj.group);

      obj = null;
    }

    if (obj?.geometry) {
      obj.geometry.dispose();
    }

    if (obj?.material) {
      Object.keys(obj.material).forEach((prop) => {
        if (!obj.material[prop]) {
          return;
        }

        if (
          obj.material[prop] &&
          typeof obj.material[prop].dispose === "function"
        ) {
          obj.material[prop].dispose();
        }
      });

      obj.material.dispose();
    }
  }
}

export default WebGLCanvas;
