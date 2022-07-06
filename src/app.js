import "./style.scss";

import { autorun } from "mobx";

import stepStore from "./store/stepStore";

import { STEP } from "./constants/step";
import { ICON } from "./constants/url";
import { TEXT } from "./constants/text";

import ui from "./utils/ui";

import Space from "./drawing/Space";

class App {
  constructor() {
    this._canvas = document.querySelector("#webgl-canvas");

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

    this.space = new Space(this._canvas);
  }

  _loading() {
    ui.addIcon(ICON.GLOBAL);
    ui.addIcon(ICON.NOTE);
    ui.addIcon(ICON.HEAR);
    ui.addIcon(ICON.INFO);

    ui.addText(TEXT.DRAW_PICTURE);

    stepStore.updateStep(STEP.START);
  }

  _starting() {}
}

new App();
