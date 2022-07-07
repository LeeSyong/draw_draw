import "./style.scss";

import { autorun } from "mobx";

import stepStore from "./store/stepStore";

import { STEP } from "./constants/step";
import { ICON } from "./constants/url";
import { TEXT } from "./constants/text";
import { MODE } from "./constants/mode";

import ui from "./utils/ui";

import WebGLCanvas from "./canvas/WebGL";
import DrawingCanvas from "./canvas/Drawing";

class App {
  constructor() {
    this._webglCanvas = document.querySelector("#webgl-canvas");
    this._drawingCanvas = document.querySelector("#drawing-canvas");
    this._drawingCtx = this._drawingCanvas.getContext("2d");
    this._changeModeWrapper = document.querySelector(".change-mode-wrapper");

    autorun(() => {
      switch (stepStore.currentStep) {
        case STEP.LOAD:
          setTimeout(this._loading, 2000);
          break;
        case STEP.START:
          this._starting();
          break;
      }
    });

    stepStore.updateStep(STEP.LOAD);

    this.webglSpace = new WebGLCanvas(this._webglCanvas);
    this.drawingSpace = new DrawingCanvas(this._drawingCanvas);
  }

  _loading() {
    ui.addIcon(ICON.GLOBAL);
    ui.addIcon(ICON.NOTE);
    ui.addIcon(ICON.HEAR);
    ui.addIcon(ICON.INFO);

    ui.addText(TEXT.DRAW_PICTURE);

    stepStore.updateStep(STEP.START);
  }

  _starting() {
    const changeMode = document.querySelector(".change-mode");
    const listen = document.querySelector(".listen");
    const showInfo = document.querySelector(".show-info");
    const changeLang = document.querySelector(".change-lang");
    const icons = [];
    icons.push(changeMode, listen, showInfo, changeLang);

    this._changeModeWrapper.addEventListener("click", () => {
      this._drawingCtx.clearRect(
        0,
        0,
        this._drawingCanvas.width,
        this._drawingCanvas.height,
      );

      if (stepStore.currentMode === MODE.PICTURE) {
        stepStore.setMode(MODE.LETTER);

        ui.changeBackgroundColor(MODE.LETTER);
        ui.changeIconColor(icons, MODE.LETTER);
        ui.addText(TEXT.DRAW_LETTER);
      } else {
        stepStore.setMode(MODE.PICTURE);

        ui.changeBackgroundColor(MODE.PICTURE);
        ui.changeIconColor(icons, MODE.PICTURE);
        ui.addText(TEXT.DRAW_PICTURE);
      }
    });
  }
}

new App();
