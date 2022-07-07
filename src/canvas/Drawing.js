import stepStore from "../store/stepStore";

import draw from "../utils/draw";

class DrawingCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");

    this._isDrawing = false;
    this._drawnAt = 0;
    this._highlightStartPoint = false;
    this._currentShape = null;
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

  _drawXY(event) {}

  _disengage(event) {}

  _updateXY(event) {
    this._prevX = this._currX;
    this._prevY = this._currY;
    this._currX = event.clientX - this._canvas.offsetLeft;
    this._currY = event.clientY - this._canvas.offsetTop;
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
