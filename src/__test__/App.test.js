/**
 * @jest-environment jsdom
 */

import { fireEvent, getByAltText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { BASE_MARK_UP } from "../constants/markUp";

describe("App", () => {
  beforeAll(() => {
    document.body.innerHTML = BASE_MARK_UP;
  });

  test("Icon images that change to letter mode and picture mode must exist in changeModeWrapper.", () => {
    const changeModeWrapper = document.querySelector(".change-mode-wrapper");
    expect(changeModeWrapper).toBeInTheDocument();

    const changeLetterModeIcon = getByAltText(
      changeModeWrapper,
      "change-letter-mode",
    );
    const changePictureModeIcon = getByAltText(
      changeModeWrapper,
      "change-picture-mode",
    );

    expect(changeModeWrapper).toContainElement(changeLetterModeIcon);
    expect(changeModeWrapper).toContainElement(changePictureModeIcon);

    expect(changeLetterModeIcon.src).toContain("letter");
    expect(changePictureModeIcon.src).toContain("picture");

    expect(changeLetterModeIcon).not.toHaveClass("hide");
    expect(changePictureModeIcon).toHaveClass("hide");
  });

  test("When changeModeWrapper is pressed, the classes of imgs in the wrapper should be changed.", async () => {
    const changeModeWrapper = document.querySelector(".change-mode-wrapper");
    expect(changeModeWrapper).toBeInTheDocument();

    const imgToShow = changeModeWrapper.querySelector(".hide");
    expect(changeModeWrapper).toContainElement(imgToShow);

    const imgToHide = changeModeWrapper.querySelector(":not([hide])");
    expect(changeModeWrapper).toContainElement(imgToHide);

    const mockHandleClick = jest.fn().mockImplementation(() => {
      imgToShow.classList.remove("hide");
      imgToShow.classList.add("show");
      imgToHide.classList.remove("show");
      imgToHide.classList.add("hide");
    });

    changeModeWrapper.addEventListener("click", mockHandleClick);

    fireEvent.click(changeModeWrapper);

    expect(mockHandleClick).toHaveBeenCalled();
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(imgToShow).not.toHaveClass("hide");
    expect(imgToHide).toHaveClass("hide");
  });

  test("A sound icon image must exist in soundWrapper.", () => {
    const soundWrapper = document.querySelector(".sound-wrapper");
    expect(soundWrapper).toBeInTheDocument();

    const soundIcon = getByAltText(soundWrapper, "sound");
    expect(soundWrapper).toContainElement(soundIcon);
    expect(soundIcon.src).toContain("sound");
    expect(soundIcon).toHaveClass("hide");
  });

  test("When soundIcon is pressed, 'hide' class of the icon should be gone.", () => {
    const soundIcon = document.querySelector(".sound");

    const mockHandleClick = jest.fn().mockImplementation(() => {
      soundIcon.classList.remove("hide");
      soundIcon.classList.add("show");
    });

    soundIcon.addEventListener("click", mockHandleClick);

    fireEvent.click(soundIcon);

    expect(mockHandleClick).toHaveBeenCalled();
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(soundIcon).not.toHaveClass("hide");
  });
});
