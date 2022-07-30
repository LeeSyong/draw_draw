import stepStore from "../store/stepStore";

import { STEP } from "../constants/step";
import { MODE } from "../constants/mode";

describe("stepStore", () => {
  test("defines actions of stepStore.", () => {
    expect(typeof stepStore.setMode).toBe("function");
    expect(typeof stepStore.updateStep).toBe("function");
  });

  test("should change the mode.", async () => {
    const setModeSpy = jest.spyOn(stepStore, "setMode");

    expect(stepStore.currentMode).not.toBeUndefined();
    expect(stepStore.currentMode).not.toBeNull();
    expect(stepStore.currentMode).toBe(MODE.PICTURE);

    stepStore.setMode(MODE.LETTER);

    expect(setModeSpy).toHaveBeenCalled();
    expect(setModeSpy).toHaveBeenCalledWith(MODE.LETTER);
    expect(stepStore.currentMode).not.toBeUndefined();
    expect(stepStore.currentMode).not.toBeNull();
    expect(stepStore.currentMode).toBe(MODE.LETTER);
  });

  test("should change the step.", () => {
    const updateStepSpy = jest.spyOn(stepStore, "updateStep");

    expect(stepStore.currentStep).not.toBeUndefined();
    expect(stepStore.currentStep).not.toBeNull();
    expect(stepStore.currentStep).toBe(STEP.LOAD);

    stepStore.updateStep(STEP.START);

    expect(updateStepSpy).toHaveBeenCalled();
    expect(updateStepSpy).toHaveBeenCalledWith(STEP.START);
    expect(stepStore.currentStep).not.toBeUndefined();
    expect(stepStore.currentStep).not.toBeNull();
    expect(stepStore.currentStep).toBe(STEP.START);
  });
});
