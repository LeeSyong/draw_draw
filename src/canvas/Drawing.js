import stepStore from "../store/stepStore";
import suggestStore from "../store/suggestStore";

import autodraw from "../api/autodraw";
import vision from "../api/vision";

import { MODE } from "../constants/mode";
import { STEP } from "../constants/step";
import { TEXT } from "../constants/text";

import eventController from "../utils/eventController";
import draw from "../utils/draw";
import ui from "../utils/ui";

class DrawingCanvas {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
    this._icons = document.querySelectorAll(".icon-wrapper");

    this._startDrawing = false;
    this._drawnAt = 0;
    this._isDrawing = false;
    this._finishDrawing = false;
    this._goToDrawing = false;
    this._processiong = false;

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

    this._canvas.addEventListener("mousedown", this._engage.bind(this));
    this._canvas.addEventListener("mousemove", this._drawXY.bind(this));
    this._canvas.addEventListener("mouseup", this._disengage.bind(this));
    this._canvas.addEventListener("mouseout", this._disengage.bind(this));
    this._canvas.addEventListener("dblclick", this._goToDraw.bind(this));

    window.addEventListener("resize", () => this._resize());
  }

  _engage(event) {
    this._icons.forEach((icon) => icon.classList.add("can-draw"));

    this._goToDrawing = false;

    if (this._finishDrawing) {
      this._shapes = [];
      this._finishDrawing = false;
    }

    if (this._processiong) {
      return;
    }

    this._updateXY(event);

    this._startDrawing = true;
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
    if (!this._startDrawing) {
      return;
    }

    this._isDrawing = true;

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
    this._icons.forEach((icon) => icon.classList.remove("can-draw"));

    if (!this._startDrawing && event.type === "mouseout") {
      return;
    }

    this._startDrawing = false;

    if (!this._isDrawing) {
      return;
    }

    this._isDrawing = false;

    if (stepStore.currentMode === MODE.PICTURE) {
      clearInterval(this._drawingInterval);

      eventController.debounce(async () => {
        if (this._startDrawing) {
          return;
        }

        this._shapes.push(this._currentShape);

        this._finishDrawing = true;

        this._processiong = true;

        const data = await autodraw.getSuggestions(this._shapes, this._canvas);
        const results = autodraw.extractDataFromApi(data);
        const parsedSuggestions = autodraw.parseSuggestions(results);
        const validSuggestions = await autodraw.validateSuggestions(
          parsedSuggestions,
        );
        const translatedSuggestions = await autodraw.translateSuggestions(
          validSuggestions,
        );

        this._processiong = false;

        if (stepStore.currentMode === MODE.LETTER) {
          return;
        }

        suggestStore.setSuggestions(translatedSuggestions);
        suggestStore.setSuggestionUrl(translatedSuggestions[0].url);
        stepStore.updateStep(STEP.SUGGEST);
      }, 500);
    } else {
      eventController.debounce(async () => {
        if (this._startDrawing) {
          return;
        }

        this._processiong = true;

        const recognizedText = await vision.recognize(this._canvas);

        this._processiong = false;

        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (stepStore.currentMode === MODE.PICTURE) {
          return;
        }

        const finalText = vision.validate(recognizedText);

        suggestStore.setText(finalText);
        stepStore.updateStep(STEP.SUGGEST);

        ui.setBackgroundColorRandomly();
      }, 1000);
    }
  }

  _goToDraw() {
    this._goToDrawing = true;

    if (stepStore.currentStep !== STEP.SUGGEST && !this._startDrawing) {
      return;
    }

    stepStore.updateStep(STEP.START);
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
