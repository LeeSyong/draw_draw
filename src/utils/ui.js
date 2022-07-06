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

  return Object.freeze({
    addIcon,
    addText,
  });
})();

export default ui;
