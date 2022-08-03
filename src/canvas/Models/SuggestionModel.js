import * as THREE from "three";
import chroma from "chroma-js";
import gsap from "gsap";

import stepStore from "../../store/stepStore";

import { MODE } from "../../constants/mode";

class SuggestionModel {
  constructor(svg, scene, ratio) {
    this._svg = svg;
    this.scene = scene;
    this._ratio = ratio;

    this._colors = [];
    this._sizes = [];

    this._material = null;
    this.vertices = [];
    this.geometry = null;
    this.group = null;

    this._getPaths(this._svg);
    this._createdMaterial();
  }

  _getPaths(svg) {
    this._paths = svg.querySelectorAll("path");
    this._svgViewBoxWidth = svg.viewBox.baseVal.width;
    this._svgViewBoxHeight = svg.viewBox.baseVal.height;

    svg.remove();
  }

  _createdMaterial() {
    const vertexShader = document.querySelector("#vertex-shader").textContent;
    const fragmentShader =
      document.querySelector("#fragment-shader").textContent;

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
    });

    this._init();
  }

  _init() {
    this._createVertices(this._paths);
    this._createGeometry(this._colors, this._sizes);
    this._createPoints();
  }

  _createVertices(paths) {
    const delay = 1;
    const getRandomColor = () => {
      return [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    };
    const randomColorArray = [...Array(5)].map(() => getRandomColor());
    const gradient = chroma.scale(randomColorArray);

    const colorRGB = {
      r: Math.random() * (stepStore.currentMode === MODE.PICTURE ? 100 : 30),
      g: Math.random() * (stepStore.currentMode === MODE.PICTURE ? 100 : 30),
      b: Math.random() * (stepStore.currentMode === MODE.PICTURE ? 100 : 30),
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

        const end = new THREE.Vector3(
          point.x - this._svgViewBoxWidth / 2,
          -point.y + this._svgViewBoxHeight / 2,
          (Math.random() - 0.5) * 50,
        );
        const start = new THREE.Vector3(
          end.x + (Math.random() - 0.5) * positionXYZ.x,
          end.y + (Math.random() - 0.5) * positionXYZ.y,
          end.z + (Math.random() - 0.5) * positionXYZ.z,
        );

        const coloursX =
          point.x / this._svgViewBoxWidth + (Math.random() - 0.5) * 0.2;
        const color = gradient(coloursX).rgb();

        this.vertices.push(end);

        end.r = 1 - (end.z + 7.5) / colorRGB.r;
        end.g = 1 - (end.z + 7.5) / colorRGB.g;
        end.b = 1 - (end.z + 7.5) / colorRGB.b;

        timeline.from(
          end,
          {
            x: start.x,
            y: start.y,
            z: start.z,
            r: color[0] / 255,
            g: color[1] / 255,
            b: color[2] / 255,
            duration: "random(1, 1.5)",
            ease: "power2.out",
          },
          delay * 0.0012,
        );

        this._sizes.push(Math.random() * 15 + 10 * this._ratio);
      }
    });
  }

  _createGeometry(colors, sizes) {
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.vertices);

    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );
    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1),
    );
  }

  _createPoints() {
    const points = new THREE.Points(this.geometry, this._material);
    const pointSize = stepStore.currentMode === MODE.PICTURE ? 0.09 : 0.08;

    points.scale.set(pointSize, pointSize, pointSize);

    const box3 = new THREE.Box3().setFromObject(points);
    const vector = new THREE.Vector3();

    box3.getCenter(vector);
    points.position.set(-vector.x, -vector.y, -vector.z);

    this.group = new THREE.Group();
    this.group.add(points);
  }
}

export default SuggestionModel;
