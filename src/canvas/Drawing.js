class DrawingCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");

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

  _engage(event) {}

  _drawXY(event) {}

  _disengage(event) {}

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
