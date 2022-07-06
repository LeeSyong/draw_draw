import { makeObservable, observable, action } from "mobx";

import { STEP } from "../constants/step";
import { MODE } from "../constants/mode";

class StepStore {
  constructor() {
    this.currentStep = STEP.LOAD;
    this.currentMode = MODE.PICTURE;

    makeObservable(this, {
      currentStep: observable,
      currentMode: observable,
      updateStep: action,
      setMode: action,
    });
  }

  updateStep(newState) {
    this.currentStep = newState;
  }

  setMode(mode) {
    this.currentMode = mode;
  }
}

const stepStore = new StepStore();

export default stepStore;
