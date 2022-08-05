import * as THREE from "three";
import chroma from "chroma-js";
import gsap from "gsap";

import stepStore from "../../store/stepStore";

import { MODE } from "../../constants/mode";

class SuggestionModel {
  constructor(svg) {
    this._svg = svg;

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
    const getRandomColor = () => {
      return [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    };
    const randomColorArray = [...Array(5)].map(() => getRandomColor());
    const gradient = chroma.scale(randomColorArray);

    const valueForEndRGB = {
      r: Math.random() * 600 + 300,
      g: Math.random() * 600 + 300,
      b: Math.random() * 600 + 300,
    };
    const distanceToEnd = {
      x: Math.random() * 3000 + 500,
      y: Math.random() * 3000 + 500,
      z: Math.random() * 3000,
    };

    const timeline = gsap.timeline({
      onReverseComplete: () => {
        timeline.timeScale(1);
        timeline.play(0);
      },
    });

    paths.forEach((path) => {
      const totalLength = path.getTotalLength();

      for (let i = 0; i < totalLength; i += 7) {
        const distance = i;
        const point = path.getPointAtLength(distance);

        const coloursX = point.x / this._svgViewBoxWidth;
        const color = gradient(coloursX).rgb();

        const end = new THREE.Vector3(
          point.x,
          -point.y,
          (Math.random() - 0.5) * 150,
        );

        end.r = 1 - (end.z + 200) / valueForEndRGB.r;
        end.g = 1 - (end.z + 200) / valueForEndRGB.g;
        end.b = 1 - (end.z + 200) / valueForEndRGB.b;

        this.vertices.push(end);

        const start = new THREE.Vector3(
          end.x + (Math.random() - 0.5) * distanceToEnd.x,
          end.y + (Math.random() - 0.5) * distanceToEnd.y,
          end.z + (Math.random() - 0.5) * distanceToEnd.z,
        );

        timeline.from(
          end,
          {
            x: start.x,
            y: start.y,
            z: start.z,
            r: color[0] / 255,
            g: color[1] / 255,
            b: color[2] / 255,
            duration: "random(1, 2)",
            ease: "power2.out",
          },
          0.001,
        );

        this._sizes.push(Math.random() * 15 + 15);
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
