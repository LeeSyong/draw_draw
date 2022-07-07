import { createWorker } from "tesseract.js";

import stepStore from "../store/stepStore";

import { MODE } from "../constants/mode";

import draw from "../utils/draw";
import autodraw from "../api/autodraw";

class DrawingCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");

    this._isDrawing = false;
    this._drawnAt = 0;
    this._highlightStartPoint = false;
    this._drawingInterval = null;
    this._intervalLastPosition = [-1, -1];
    this._currentShape = null;
    this._shapes = [];
    this._prevX = 0;
    this._prevY = 0;
    this._currX = 0;
    this._currY = 0;

    this._resize();

    this._canvas.addEventListener("mousedown", (event) => this._engage(event));
    this._canvas.addEventListener("mousemove", (event) => this._drawXY(event)); // 그림 쪽에서는 putPoints
    this._canvas.addEventListener("mouseup", (event) => this._disengage(event));
    this._canvas.addEventListener("mouseup", (event) => this._disengage(event));

    this._canvas.addEventListener("mouseout", (event) =>
      this._disengage(event),
    );

    window.addEventListener("resize", () => this._resize());

    this.initWorker();
  }

  async initWorker() {
    this._worker = createWorker();

    await this._worker.load();
    await this._worker.loadLanguage("kor");
    await this._worker.initialize("kor");
  }

  _engage(event) {
    this._updateXY(event);

    this._isDrawing = true;
    this._drawnAt = Date.now();
    this._highlightStartPoint = true;

    this._currentShape = [[], [], []];

    draw.drawStartPoint(
      this._ctx,
      this._currX,
      this._currY,
      stepStore.currentMode,
    );

    this._highlightStartPoint = false;
  }

  _drawXY(event) {
    if (!this._isDrawing) {
      return;
    }

    if (stepStore.currentMode === MODE.PICTURE) {
      this._drawingInterval = setInterval(
        this._drawingShape(this._intervalLastPosition),
        9,
      );
    }

    this._updateXY(event);
    this._resize();

    draw.drawLine(
      this._ctx,
      this._prevX,
      this._prevY,
      this._currX,
      this._currY,
      stepStore.currentMode,
    );
  }

  async _disengage(event) {
    this._isDrawing = false;

    if (!this._isDrawing && event.type === "mouseout") {
      return;
    }

    if (stepStore.currentMode === MODE.PICTURE) {
      clearInterval(this._drawingInterval);
      this._shapes.push(this._currentShape);

      (() => {
        if (this._timer) {
          clearTimeout(this._timer);
        }

        this._timer = setTimeout(async () => {
          const data = await autodraw.getSuggestions(this._shapes);
          const results = autodraw.extractDataFromApi(data);
          const parsedResults = autodraw.parseSuggestions(results);
        }, 1000);
      })();
    } else {
      (() => {
        if (this._timer) {
          clearTimeout(this._timer);
        }

        this._timer = setTimeout(async () => {
          const {
            data: { text },
          } = await this._worker.recognize(this._canvas);
        }, 1000);
      })();
    }
  }

  _updateXY(event) {
    this._prevX = this._currX;
    this._prevY = this._currY;
    this._currX = event.clientX - this._canvas.offsetLeft;
    this._currY = event.clientY - this._canvas.offsetTop;
  }

  _drawingShape(intervalLastPosition) {
    if (
      intervalLastPosition[0] === this._prevX &&
      intervalLastPosition[1] === this._prevY
    ) {
      return;
    }

    this._currentShape[0].push(this._prevX);
    this._currentShape[1].push(this._prevY);
    this._currentShape[2].push(Date.now() - this._drawnAt);

    this._intervalLastPosition = [this._prevX, this._prevY];
  }

  _resize() {
    const displayWidth = this._canvas.clientWidth;
    const displayHeight = this._canvas.clientHeight;

    const needResize =
      this._canvas.width !== displayWidth ||
      this._canvas.height !== displayHeight;

    if (needResize) {
      this._canvas.width = displayWidth;
      this._canvas.height = displayHeight;
    }

    return needResize;
  }
}

export default DrawingCanvas;
