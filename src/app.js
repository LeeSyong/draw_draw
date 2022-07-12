import "./style.scss";

import { autorun, toJS } from "mobx";

import stepStore from "./store/stepStore";
import suggestStore from "./store/suggestStore";

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
    this._suggestionList = document.querySelector(".suggestions ul");
    this._changeModeIcon = document.querySelector(".change-mode");
    this._changeLangIcon = document.querySelector(".change-lang");
    this._showInfoIcon = document.querySelector(".show-info");
    this._icons = [
      this._changeModeIcon,
      this._showInfoIcon,
      this._changeLangIcon,
    ];
    this._soundIcon = document.querySelector(".sound");

    autorun(() => {
      switch (stepStore.currentStep) {
        case STEP.LOAD:
          setTimeout(this._loading.bind(this), 2000);
          break;
        case STEP.START:
          this._starting();
          break;
        case STEP.SUGGEST:
          this._suggesting();
          break;
      }
    });

    this.webglSpace = new WebGLCanvas(this._webglCanvas);
  }

  _loading() {
    this.drawingSpace = new DrawingCanvas(this._drawingCanvas);

    ui.showIcon(ICON.CHANGE_LETTER_MODE);
    ui.showIcon(ICON.CHANGE_LANG);
    ui.showIcon(ICON.SHOW_INFO);
    ui.addText(TEXT.DRAW_PICTURE);

    this._changeModeIcon.addEventListener("click", () => {
      if (stepStore.currentMode === MODE.PICTURE) {
        stepStore.setMode(MODE.LETTER);
      } else {
        stepStore.setMode(MODE.PICTURE);
      }

      stepStore.updateStep(STEP.START);
    });

    this._changeLangIcon.addEventListener("click", () => {});

    this._showInfoIcon.addEventListener("click", () => {});

    this._soundIcon.addEventListener("click", () => {});
  }

  _starting() {
    this._drawingCtx.clearRect(
      0,
      0,
      this._drawingCanvas.width,
      this._drawingCanvas.height,
    );
    this._suggestionList.innerText = "";
    this._drawingCanvas.style.zIndex = 5;

    ui.hideIcon(ICON.SOUND);

    if (stepStore.currentMode === MODE.PICTURE) {
      ui.changeBackgroundColor(MODE.PICTURE);
      ui.changeIconColor(this._icons, MODE.PICTURE);
      ui.addText(TEXT.DRAW_PICTURE);
    } else {
      ui.changeBackgroundColor(MODE.LETTER);
      ui.changeIconColor(this._icons, MODE.LETTER);
      ui.addText(TEXT.DRAW_LETTER);
    }
  }

  _suggesting() {
    this._drawingCtx.clearRect(
      0,
      0,
      this._drawingCanvas.width,
      this._drawingCanvas.height,
    );

    ui.showIcon(ICON.SOUND);
    ui.setBackgroundColorRandomly();

    if (stepStore.currentMode === MODE.PICTURE) {
      this._suggestionList.innerText = "";

      ui.displaySuggestions(toJS(suggestStore.suggestions));
    }
  }
}

new App();
