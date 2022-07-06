import { MODE } from "../constants/mode";

const ui = (() => {
  const addIcon = (iconInfo) => {
    const svgContainer = document.querySelector(`.${iconInfo.ALT}-wrapper`);
    const svgImg = document.createElement("img");

    svgImg.src = iconInfo.SRC;
    svgImg.alt = iconInfo.ALT;
    svgImg.classList.add("svg-img");
    svgImg.classList.add(iconInfo.ALT);
    svgImg.classList.add("filter-white");

    svgContainer.appendChild(svgImg);

    return svgImg;
  };

  const addText = (text) => {
    const infoWrapper = document.querySelector(".info-wrapper");
    const infoSpan = document.createElement("span");

    infoSpan.classList.add("info-text");
    infoSpan.textContent = text;

    if (text.slice(0, 2) === "그림") {
      infoSpan.classList.remove("info-letter");
      infoSpan.classList.add("info-picture");
    } else {
      infoSpan.classList.remove("info-picture");
      infoSpan.classList.add("info-letter");
    }

    infoWrapper.appendChild(infoSpan);

    setTimeout(() => {
      infoSpan.remove();
    }, 1000);
  };

  const changeBackgroundColor = (mode) => {
    const { body } = document;

    if (mode === MODE.PICTURE) {
      body.classList.remove("white");
      body.classList.add("black");
    } else {
      body.classList.remove("black");
      body.classList.add("white");
    }
  };

  const changeIconColor = (icons, mode) => {
    if (mode === MODE.PICTURE) {
      icons.forEach((icon) => {
        icon.classList.remove("filter-black");
        icon.classList.add("filter-white");
      });
    } else {
      icons.forEach((icon) => {
        icon.classList.remove("filter-white");
        icon.classList.add("filter-black");
      });
    }
  };

  return Object.freeze({
    addIcon,
    addText,
    changeBackgroundColor,
    changeIconColor,
  });
})();

export default ui;
