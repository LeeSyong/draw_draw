import "./style.scss";

import { autorun } from "mobx";

import Space from "./drawing/Space";

import stepStore from "./store/stepStore";
import { STEP } from "./constants/step";

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
    stepStore.updateStep(STEP.START);
  }

  _starting() {}
}

new App();
