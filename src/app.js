import "./style.scss";

import { autorun, toJS } from "mobx";

import stepStore from "./store/stepStore";
import suggestStore from "./store/suggestStore";

import TextToSpeech from "./api/webSpeech";

import { ICON } from "./constants/url";
import { MODE } from "./constants/mode";
import { STEP } from "./constants/step";
import { TEXT } from "./constants/text";

import ui from "./utils/ui";

import WebGLCanvas from "./canvas/WebGL";
import DrawingCanvas from "./canvas/Drawing";

class App {
  constructor() {
    this._webglCanvas = document.querySelector("#webgl-canvas");
    this._drawingCanvas = document.querySelector("#drawing-canvas");
    this._drawingCtx = this._drawingCanvas.getContext("2d");
    this._suggestionList = document.querySelector(".suggestions ul");
    this._changeModeWrapper = document.querySelector(".change-mode-wrapper");
    this._soundIcon = document.querySelector(".sound");

    autorun(() => {
      switch (stepStore.currentStep) {
        case STEP.LOAD:
          this._loading();
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
    this.textToSpeech = new TextToSpeech();
  }

  _loading() {
    this.drawingSpace = new DrawingCanvas(this._drawingCanvas);

    ui.showIcon(ICON.CHANGE_LETTER_MODE);
    ui.addText(TEXT.DRAW_PICTURE);

    this._changeModeWrapper.addEventListener("click", () => {
      if (stepStore.currentMode === MODE.PICTURE) {
        stepStore.setMode(MODE.LETTER);
      } else {
        stepStore.setMode(MODE.PICTURE);
      }

      stepStore.updateStep(STEP.START);
    });

    this._soundIcon.addEventListener("click", () => {
      this.textToSpeech._setting();

      const target =
        stepStore.currentMode === MODE.PICTURE
          ? this._suggestionList.querySelector(".selected").textContent
          : suggestStore.text;

      this.textToSpeech._converting(target);
    });
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
    suggestStore.setSuggestions([]);
    suggestStore.setSuggestionUrl("");
    suggestStore.setText("");

    if (stepStore.currentMode === MODE.PICTURE) {
      ui.changeBackgroundColor(MODE.PICTURE);
      ui.hideIcon(ICON.CHANGE_PICTURE_MODE);
      ui.showIcon(ICON.CHANGE_LETTER_MODE);
      ui.changeIconColor(ICON.SOUND, MODE.PICTURE);
      ui.addText(TEXT.DRAW_PICTURE);
    } else {
      ui.changeBackgroundColor(MODE.LETTER);
      ui.hideIcon(ICON.CHANGE_LETTER_MODE);
      ui.showIcon(ICON.CHANGE_PICTURE_MODE);
      ui.changeIconColor(ICON.SOUND, MODE.LETTER);
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

    if (stepStore.currentMode === MODE.PICTURE) {
      this._suggestionList.innerText = "";

      ui.setBackgroundColorRandomly(MODE.PICTURE);
      ui.displaySuggestions(toJS(suggestStore.suggestions));
    }
  }
}

new App();
